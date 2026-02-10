---
name: powershell-integration
description: Integrates PowerShell scripts with Node.js applications using child_process.spawn. Handles PowerShell invocation, stream management, error handling, and platform detection. Use when the user needs to call PowerShell scripts from Node.js or mentions pwsh, PowerShell automation, or Windows-specific tasks.
---

# PowerShell Integration from Node.js

Integrates PowerShell scripts with Node.js using `child_process.spawn`. Provides reliable patterns for invoking PowerShell commands, handling streams, and managing errors.

## When to Use This Skill

- User needs to call PowerShell from Node.js
- User mentions pwsh or PowerShell
- User wants Windows-specific automation
- User needs to execute .ps1 scripts
- User mentions platform-specific tasks
- User wants to check PowerShell availability

## Philosophy: Node.js First, PowerShell When Necessary

**Prefer Node.js APIs:**
- Use Node.js `fs`, `path`, `child_process` where possible
- Better cross-platform compatibility
- Fewer platform-specific edge cases
- Easier debugging and testing

**Use PowerShell when:**
- Platform-specific Windows administration required
- Need native Windows PowerShell modules
- Interacting with Windows-specific APIs
- Leveraging existing PowerShell scripts

## Basic PowerShell Invocation

### Check PowerShell Availability

```javascript
const { spawnSync } = require('child_process');

function checkPowerShellAvailable() {
  const check = spawnSync('pwsh', ['-NoProfile', '-Command', 'Write-Output', 'OK']);
  
  if (check.error) {
    throw new Error(
      'PowerShell (pwsh) is not available on PATH. ' +
      'Please install PowerShell Core and ensure `pwsh` is accessible.'
    );
  }
  
  return true;
}

// Call during extension activation
try {
  checkPowerShellAvailable();
} catch (error) {
  vscode.window.showErrorMessage(error.message);
}
```

### Simple Command Execution

```javascript
const { spawn } = require('child_process');

function runPowerShellCommand(command) {
  return new Promise((resolve, reject) => {
    const ps = spawn('pwsh', [
      '-NoProfile',
      '-Command',
      command
    ]);
    
    let stdout = '';
    let stderr = '';
    
    ps.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });
    
    ps.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });
    
    ps.on('close', code => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`PowerShell exited with code ${code}: ${stderr}`));
      }
    });
    
    ps.on('error', error => {
      reject(new Error(`Failed to spawn PowerShell: ${error.message}`));
    });
  });
}

// Usage
try {
  const result = await runPowerShellCommand('Get-Date -Format "yyyy-MM-dd"');
  console.log('Date:', result);
} catch (error) {
  console.error('PowerShell error:', error);
}
```

## Interactive PowerShell Session

For multiple commands or script blocks:

```javascript
const { spawn } = require('child_process');

class PowerShellSession {
  constructor() {
    this.ps = spawn('pwsh', [
      '-NoProfile',
      '-Command',
      '-'  // Read from stdin
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    this.setupHandlers();
  }
  
  setupHandlers() {
    this.ps.stdout.on('data', chunk => {
      console.log('[pwsh stdout]', chunk.toString());
    });
    
    this.ps.stderr.on('data', chunk => {
      console.error('[pwsh stderr]', chunk.toString());
    });
    
    this.ps.on('close', code => {
      console.log(`[pwsh] exited with ${code}`);
    });
    
    this.ps.on('error', error => {
      console.error('[pwsh] spawn error:', error);
    });
  }
  
  execute(command) {
    return new Promise((resolve, reject) => {
      const marker = `###END_OF_OUTPUT_${Date.now()}###`;
      
      // Add output marker
      this.ps.stdin.write(`${command}\n`);
      this.ps.stdin.write(`Write-Output '${marker}'\n`);
      
      let output = '';
      const handler = (chunk) => {
        output += chunk.toString();
        
        if (output.includes(marker)) {
          this.ps.stdout.off('data', handler);
          // Remove marker from output
          output = output.split(marker)[0].trim();
          resolve(output);
        }
      };
      
      this.ps.stdout.on('data', handler);
    });
  }
  
  close() {
    this.ps.stdin.end();
  }
}

// Usage
const session = new PowerShellSession();

try {
  const date = await session.execute('Get-Date -Format "yyyy-MM-dd"');
  console.log('Date:', date);
  
  const files = await session.execute('Get-ChildItem -Name');
  console.log('Files:', files);
} finally {
  session.close();
}
```

## Running PowerShell Scripts

### Execute .ps1 File

```javascript
const { spawn } = require('child_process');
const path = require('path');

function runPowerShellScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const ps = spawn('pwsh', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', scriptPath,
      ...args
    ]);
    
    let stdout = '';
    let stderr = '';
    
    ps.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });
    
    ps.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });
    
    ps.on('close', code => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Script failed (exit ${code}): ${stderr}`));
      }
    });
    
    ps.on('error', error => {
      reject(error);
    });
  });
}

// Usage
const scriptPath = path.join(__dirname, 'scripts', 'deploy.ps1');
try {
  const result = await runPowerShellScript(scriptPath, ['-Verbose']);
  console.log('Deployment result:', result);
} catch (error) {
  console.error('Deployment failed:', error);
}
```

## Handling Output Streams

### Separate stdout and stderr

```javascript
function runWithStreams(command) {
  return new Promise((resolve, reject) => {
    const ps = spawn('pwsh', ['-NoProfile', '-Command', command]);
    
    const output = {
      stdout: [],
      stderr: []
    };
    
    ps.stdout.on('data', chunk => {
      const line = chunk.toString().trim();
      if (line) {
        output.stdout.push(line);
        console.log('[OUT]', line);
      }
    });
    
    ps.stderr.on('data', chunk => {
      const line = chunk.toString().trim();
      if (line) {
        output.stderr.push(line);
        console.error('[ERR]', line);
      }
    });
    
    ps.on('close', code => {
      resolve({
        code,
        stdout: output.stdout,
        stderr: output.stderr
      });
    });
    
    ps.on('error', reject);
  });
}
```

## Error Handling

### Comprehensive Error Handling

```javascript
async function safePowerShellExec(command) {
  try {
    // Check availability first
    checkPowerShellAvailable();
    
    // Execute command
    const result = await runPowerShellCommand(command);
    return { success: true, output: result };
    
  } catch (error) {
    // Categorize errors
    if (error.message.includes('not available on PATH')) {
      return {
        success: false,
        error: 'PWSH_NOT_FOUND',
        message: 'PowerShell not installed',
        userMessage: 'Please install PowerShell Core from https://github.com/PowerShell/PowerShell'
      };
    }
    
    if (error.message.includes('exited with code')) {
      return {
        success: false,
        error: 'EXECUTION_FAILED',
        message: error.message,
        userMessage: 'PowerShell command failed. Check logs for details.'
      };
    }
    
    return {
      success: false,
      error: 'UNKNOWN',
      message: error.message,
      userMessage: 'An unexpected error occurred'
    };
  }
}

// Usage in VS Code extension
const result = await safePowerShellExec('Get-Process -Name "code"');
if (!result.success) {
  vscode.window.showErrorMessage(result.userMessage);
  console.error('PowerShell error:', result.message);
} else {
  console.log('Output:', result.output);
}
```

## Platform Detection

### Detect OS and PowerShell Type

```javascript
const os = require('os');

function getPowerShellCommand() {
  const platform = os.platform();
  
  if (platform === 'win32') {
    // Windows: try pwsh first, fall back to powershell.exe
    return 'pwsh';
  } else {
    // Linux/macOS: PowerShell Core only
    return 'pwsh';
  }
}

function checkPowerShellVersion() {
  const cmd = getPowerShellCommand();
  const check = spawnSync(cmd, [
    '-NoProfile',
    '-Command',
    '$PSVersionTable.PSVersion.ToString()'
  ]);
  
  if (check.error) {
    throw new Error(`PowerShell not available: ${check.error.message}`);
  }
  
  const version = check.stdout.toString().trim();
  console.log(`PowerShell version: ${version}`);
  return version;
}
```

## Best Practices

### 1. Always Use -NoProfile

Prevents user profile loading, ensuring consistent behavior:
```javascript
spawn('pwsh', ['-NoProfile', ...]);
```

### 2. Handle Encoding

Specify encoding for consistent output:
```javascript
const ps = spawn('pwsh', ['-NoProfile', '-Command', command], {
  encoding: 'utf8'
});
```

### 3. Timeout Long-Running Commands

```javascript
function runWithTimeout(command, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const ps = spawn('pwsh', ['-NoProfile', '-Command', command]);
    
    const timer = setTimeout(() => {
      ps.kill('SIGTERM');
      reject(new Error(`Command timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    let stdout = '';
    ps.stdout.on('data', chunk => stdout += chunk.toString());
    
    ps.on('close', code => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
```

### 4. Validate Script Paths

```javascript
const fs = require('fs');

function runScriptSafely(scriptPath, args = []) {
  // Validate script exists
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script not found: ${scriptPath}`);
  }
  
  // Validate extension
  if (!scriptPath.endsWith('.ps1')) {
    throw new Error(`Invalid PowerShell script: ${scriptPath}`);
  }
  
  return runPowerShellScript(scriptPath, args);
}
```

## Common Patterns

### Get Environment Variable

```javascript
async function getPowerShellEnv(varName) {
  const command = `$env:${varName}`;
  const result = await runPowerShellCommand(command);
  return result || null;
}

// Usage
const path = await getPowerShellEnv('PATH');
```

### Run With Progress

```javascript
async function runWithProgress(command, progressCallback) {
  const ps = spawn('pwsh', ['-NoProfile', '-Command', command]);
  
  ps.stdout.on('data', chunk => {
    const lines = chunk.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        progressCallback(line.trim());
      }
    });
  });
  
  return new Promise((resolve, reject) => {
    ps.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Failed with code ${code}`));
    });
  });
}

// Usage in VS Code
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: 'Running PowerShell script'
}, async (progress) => {
  await runWithProgress('& ./long-script.ps1', (message) => {
    progress.report({ message });
  });
});
```

## Documentation Requirements

When using PowerShell integration, document:

1. **PowerShell version requirements** (e.g., "Requires PowerShell 7+")
2. **Required modules** (e.g., "Requires Az module")
3. **Installation instructions** for PowerShell Core
4. **Platform limitations** (e.g., "Windows only")

## Related Documentation

- [Node.js child_process](https://nodejs.org/api/child_process.html)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [PowerShell Core Installation](https://github.com/PowerShell/PowerShell#get-powershell)
