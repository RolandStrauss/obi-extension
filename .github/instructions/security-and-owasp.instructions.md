---
applyTo: '*'
description: 'Lancelot-specific secure coding requirements for VS Code extension. Covers GitLab token security, IBM i credential protection, Jira API security, CL command injection prevention, SSRF mitigation, and data leakage prevention.'
---

# Security Guidelines for Lancelot Extension

**Core Directive:** Ensure all code is secure by default. Operate with a security-first mindset. When in doubt, choose the more secure option and explain the reasoning.

---

## Lancelot-Specific Threat Model

The Lancelot VS Code extension integrates with three primary external services: **GitLab**, **Jira**, and **IBM i**. This section defines Lancelot-specific threats and mitigations aligned with the OWASP Top 10 framework.

### Threat 1: GitLab Token Exposure & Theft

**Severity:** CRITICAL | **OWASP:** A07 (Authentication Failures), A08 (Data Integrity Failures)

**Attack Scenarios:**
1. **Token Hardcoded in Code**: Credentials accidentally committed to repository
2. **Token Logged**: Token appears in debug logs, telemetry, or user messages
3. **Token Stored Insecurely**: Stored in workspace.json or plain text files
4. **Token Transmitted Over HTTP**: API calls use unencrypted connection
5. **Token Exposed via Memory Dump**: Attacker gains access to development machine and reads running process memory

**Mitigations (Required):**

```typescript
// ✅ CORRECT: Store token in VS Code SecretStorage
const token = await context.secrets.get('gitlab.token');
if (!token) {
    vscode.window.showErrorMessage('GitLab token not configured');
    return;
}

// ❌ WRONG: Hardcoded token
const token = 'glpat-abc123xyz789';

// ❌ WRONG: Stored in workspace state
await context.workspaceState.update('gitlabToken', token);

// ❌ WRONG: Logged to console
console.log(`Using token: ${token}`);

// ❌ WRONG: Transmitted over HTTP
const response = await fetch(`http://gitlab.example.com/api/v4/projects?token=${token}`);
```

**Code Review Checklist:**
- ☐ No GitLab tokens hardcoded in source code
- ☐ No tokens logged or included in error messages
- ☐ All GitLab API calls use HTTPS (not HTTP)
- ☐ Token stored via `context.secrets.get/set` (not `context.workspaceState`)
- ☐ Token is refreshed before expiration (using OAuth2 refresh token if available)
- ☐ Token validation cached to avoid excessive API calls

---

### Threat 2: IBM i Credential Exposure

**Severity:** CRITICAL | **OWASP:** A07 (Authentication Failures), A02 (Cryptographic Failures)

**Attack Scenarios:**
1. **SSH Credentials Hardcoded**: Username/password in source code
2. **Credentials Stored in .env**: Unencrypted .env file readable by other users
3. **SSH Key File Permissions**: Private key file world-readable (permission 644 instead of 600)
4. **Credentials Logged**: Connection strings logged with credentials visible
5. **Connection Eavesdropping**: SSH connection unencrypted or using weak algorithms

**Mitigations (Required):**

```typescript
// ✅ CORRECT: Read from SecretStorage or environment variables
const config = {
    host: process.env.IBM_I_HOST || 'ibmi.example.com',
    user: process.env.IBM_I_USER || 'TESTUSER',
    password: await context.secrets.get('ibmi.password')
};

// ✅ CORRECT: Store SSH key in OS-protected location
// Verify file permissions: should be 600 (owner read/write only)

// ❌ WRONG: Hardcoded credentials
const config = {
    host: 'ibmi.example.com',
    user: 'TESTUSER',
    password: 'SecurePassword123'
};

// ❌ WRONG: Credentials in logs
logger.info(`Connecting to IBM i: ${config.user}@${config.host}:${config.password}`);

// ❌ WRONG: SSH key stored in repository
const sshKey = fs.readFileSync('.ssh/private_key');
```

**Code Review Checklist:**
- ☐ No IBM i credentials hardcoded in source code
- ☐ No credentials logged or included in error messages
- ☐ SSH connections use secure algorithms (ECDSA, ED25519, not DSS)
- ☐ SSH key file permissions verified (mode 600, not readable by others)
- ☐ SSH key passphrase is strong (if applicable)
- ☐ Server host key verified (prevent man-in-the-middle)
- ☐ Connection timeouts configured (no infinite waits)

---

### Threat 3: Jira API Token Exposure

**Severity:** CRITICAL | **OWASP:** A07 (Authentication Failures)

**Attack Scenarios:**
1. **API Token Hardcoded**: Token committed to repository
2. **API Token Logged**: Token appears in telemetry or debug logs
3. **API Token Transmitted Unencrypted**: HTTPS not used
4. **API Token Scope Too Broad**: Token grants admin access when read-only needed

**Mitigations (Required):**

```typescript
// ✅ CORRECT: Store token in SecretStorage
const jiraToken = await context.secrets.get('jira.apiToken');

// ✅ CORRECT: Use HTTPS for all Jira API calls
const response = await fetch('https://jira.example.com/rest/api/3/issues', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${jiraToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ /* issue data */ })
});

// ❌ WRONG: Hardcoded token
const jiraToken = 'ATATT3xFfGF0SxDzDyR1E2F3G4H5I6J7K8L9M0N1';

// ❌ WRONG: Token in logs (even partial)
logger.info(`Using Jira token: ${jiraToken.substring(0, 10)}...`);

// ❌ WRONG: Unencrypted HTTP
await fetch('http://jira.example.com/rest/api/3/issues', { Authorization: `Bearer ${jiraToken}` });
```

**Code Review Checklist:**
- ☐ No Jira API tokens hardcoded in source code
- ☐ No tokens logged or included in error messages
- ☐ All Jira API calls use HTTPS (not HTTP)
- ☐ API token stored via `context.secrets.get/set`
- ☐ API token scope is minimal (read-only when possible)

---

### Threat 4: CL Command Injection (IBM i)

**Severity:** HIGH | **OWASP:** A03 (Injection)

**Attack Scenarios:**
1. **Unsanitized Library Name**: User provides library name `MYLIB; DLTLIB QGPL;` → Both get executed
2. **Unsanitized Member Name**: Member name contains CL command separators
3. **Path Traversal in Source File**: User provides path `../../SENSITIVE/SOURCE.MBR` → Accesses unintended file

**Mitigations (Required):**

```typescript
// ❌ WRONG: Direct string interpolation
const cmd = `DSPLIB LIB(${userProvidedLibrary})`;

// ✅ CORRECT: Validate identifier
function validateLibrarianIdentifier(name: string): string {
    // Identifiers must be alphanumeric, max 10 chars, no special chars
    if (!/^[A-Z0-9_]{1,10}$/.test(name.toUpperCase())) {
        throw new ValidationError(`Invalid library name: ${name}`);
    }
    return name.toUpperCase();
}

const safeLibrary = validateLibrarianIdentifier(userProvidedLibrary);
const cmd = `DSPLIB LIB(${safeLibrary})`; // Safe: library can only be valid identifiers

// ❌ WRONG: Insufficient sanitization
const safeLibrary = userProvidedLibrary.replace(/;/g, ''); // Still vulnerable
```

**Code Review Checklist:**
- ☐ All user-provided identifiers (library names, member names, file names) validated
- ☐ Only alphanumeric, underscore allowed
- ☐ Length limits enforced (e.g., 10 chars for library names)
- ☐ No shell metacharacters allowed (`;`, `|`, `&`, `<`, `>`, `(`, `)`)
- ☐ CL command string never constructed by direct concatenation

---

### Threat 5: Server-Side Request Forgery (SSRF) via Webhooks

**Severity:** MEDIUM | **OWASP:** A01 (Broken Access Control), A10 (SSRF)

**Attack Scenarios:**
1. **GitLab Webhook URL Manipulation**: Attacker configures webhook URL pointing to internal service
2. **IBM i SSH Host Spoofing**: Configuration allows connecting to attacker-controlled host

**Mitigations (Required):**

```typescript
// ❌ WRONG: Accept any webhook URL
const webhookUrl = userProvidedInput; // Could be http://127.0.0.1/admin
axios.post(webhookUrl, payload);

// ✅ CORRECT: Validate webhook URL
function validateWebhookUrl(url: string): boolean {
    try {
        const parsed = new URL(url);

        // Deny localhost/private ranges
        const disallowedHosts = [
            'localhost', '127.0.0.1', '0.0.0.0',
            /^192\.168\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./  // Private IP ranges
        ];

        for (const disallowed of disallowedHosts) {
            if (typeof disallowed === 'string' && parsed.hostname === disallowed) return false;
            if (disallowed instanceof RegExp && disallowed.test(parsed.hostname)) return false;
        }

        // Only allow HTTPS (not HTTP)
        if (parsed.protocol !== 'https:') return false;

        return true;
    } catch (e) {
        return false; // Invalid URL
    }
}
```

**Code Review Checklist:**
- ☐ All user-provided URLs validated (not localhost, not private IPs, HTTPS only)
- ☐ Webhook URLs from external services validated
- ☐ IBM i hostname/IP validated against allowlist

---

### Threat 6: Data Leakage via Logs & Telemetry

**Severity:** MEDIUM | **OWASP:** A04 (Insecure Data Exposure)

**Attack Scenarios:**
1. **Credentials in Logs**: Password or token appears in extension logs
2. **Query Results Logged**: API response containing sensitive data
3. **Telemetry Exfiltration**: Sensitive data sent to analytics service

**Mitigations (Required):**

```typescript
// ❌ WRONG: Logging credentials
logger.info(`Connecting to GitLab: ${gitlabToken}`);
logger.debug(`IBM i password: ${password}`);

// ✅ CORRECT: Log only non-sensitive metadata
logger.info(`Connecting to GitLab as user: ${username}`);
logger.debug(`Authentication method: token (masked)`);

// ❌ WRONG: Logging full API response
const projects = await gitlabClient.getProjects();
logger.debug(`Projects: ${JSON.stringify(projects)}`); // Contains sensitive data

// ✅ CORRECT: Log only safe metadata
logger.info(`Fetched ${projects.length} projects`);

// ❌ WRONG: Sending sensitive data to telemetry
trackEvent('gitlab.api.call', {
    token: gitlabToken, // NEVER
    projectData: projectList // NEVER
});

// ✅ CORRECT: Send only safe metrics
trackEvent('gitlab.api.call', {
    endpoint: 'GET /projects',
    responseCode: 200,
    durationMs: 250,
    projectCount: 42 // Just the count, not the data
});
```

**Code Review Checklist:**
- ☐ No credentials logged (tokens, passwords, private keys)
- ☐ No API responses logged (could contain sensitive data)
- ☐ Telemetry events sanitized (no PII, credentials, or customer data)
- ☐ Error messages don't expose internal service details
- ☐ Failed authentication attempts logged (for audit), but password not logged
