---
applyTo: 'src/ibmi/** test/**'
description: 'IBM i testing: safe SSH patterns, environment setup, RPGLE/SQL dev, mock strategies.'
---

# IBM i Integration Testing Guide

## Test Organization & Safety

### Test Tiers (by safety level)

| Tier | Scope | Mocking | Env Vars | Safety | Command |
|------|-------|---------|----------|--------|---------|
| **Unit** | Individual functions, services | Full mocks (sinon) | None required | ✅ SAFE | `npm run test:unit` |
| **Integration** | Service + IBM i interaction | Partial or None | `IBM_I_HOST` required | ⚠️ REQUIRES TEST VM | `npm run test:integration` |
| **Secret** | Real credentials from SecretStorage | None | `ENABLE_SECRET_TESTS=1` | 🔴 DANGEROUS | Only manual via flag |

**Rule**: By default, skip integration tests. Run only when `IBM_I_HOST` env var is set AND you have a scrubbed test VM.

## IBM i Test Files by Coverage

| Test File | Coverage | Mock Strategy |
|-----------|----------|---------------|
| `ibmi.test.ts` | IbmiService SSH connectivity | Mock ssh2 library, fake IBM i responses |
| `ibmi_adapter.test.ts` | Code for IBM i extension bridge | Mock extension API, stub getCodeForIbmiInstance() |
| `commands/ibmiCommands.test.ts` | IBM i-specific commands | Mock IbmiService, no real connections |
| `commands/ibmiIntegrationCommands.ensureConnected.test.ts` | Connection validation | Mock connection state, test retry logic |
| `workspace/syncManager.ibmiGating.test.ts` | Sync gating | Mock connection checks, verify gating behavior |
| `utils/metadata-ibmi-roundtrip.test.ts` | Metadata serialization | No IBM i connection, pure data transformation |

## Environment Setup (Local Development)

### Required for Integration Tests
```bash
# DO NOT COMMIT these values
export IBM_I_HOST="your-test-ibmi-host.example.com"
export IBM_I_USER="testuser"
export IBM_I_PASSWORD="testpassword"  # Or use VS Code SecretStorage
export LANCELOT_IBM_I_TIMEOUT=30000   # 30 seconds for slow hosts
```

### Preferred Approach
- Store credentials in VS Code SecretStorage API (not env vars)
- Use a dedicated scrubbed IBM i test VM (never production)
- Use fake library/member names that start with `TEST` prefix

## Test Gating Pattern

Integration tests should check for environment configuration before running:

```typescript
// Pattern used throughout codebase
const IBM_I_HOST = process.env.IBM_I_HOST;
const IBM_I_USER = process.env.IBM_I_USER;

if (!IBM_I_HOST || !IBM_I_USER) {
  console.log('Skipping IBM i integration tests (no IBM_I_HOST env var)');
  return;
}

describe('IBM i Integration Commands', function() {
  this.timeout(30000); // Increase timeout for network calls
  // ... tests that use real IBM i connections
});
```

## IBM i Unit Test Mocking (Recommended)

```typescript
import sinon from 'sinon';
import { IbmiService } from '../../src/ibmi/ibmiService';

describe('IBM i Commands', () => {
  let ibmiService: sinon.SinonStubbedInstance<IbmiService>;

  beforeEach(() => {
    ibmiService = sinon.createStubInstance(IbmiService);
    ibmiService.isConnected.returns(true);
    ibmiService.uploadMember.resolves({ success: true });
    ibmiService.compileMember.resolves({ success: true, messages: [] });
  });

  it('should upload member when connected', async () => {
    await uploadMemberCommand(ibmiService, 'MYLIB', 'MYSRC', 'TEST');
    sinon.assert.calledOnce(ibmiService.uploadMember);
  });

  it('should handle upload failures gracefully', async () => {
    ibmiService.uploadMember.rejects(new Error('Network timeout'));
    // ... test error handling
  });
});
```

## Connection Timeout Configuration

The extension respects `lancelot.timeouts.network.*` configuration keys in `package.json`:

```typescript
// From src/ibmi/ibmiService.ts
const timeout = vscode.workspace
  .getConfiguration()
  .get('lancelot.timeouts.networkConnectMs', 30000);

const sshConnection = await ssh.connect({
  host: ibmiHost,
  username: ibmiUser,
  password: ibmiPassword,
  readyTimeout: timeout  // Configurable, prevents hangs
});
```

## Best Practices for IBM i Testing

1. **Mock by default**: Use sinon stubs for IbmiService in unit tests
2. **Gate integration tests**: Check for `IBM_I_HOST` env var before running
3. **Use isolated test VMs**: Never test against production systems
4. **Scrub test data**: Use fake names (TEST_MYLIB, TEST_SOURCE, TEST_MEMBER)
5. **Increase timeouts**: IBM i SSH connections can be slow (10-30 seconds)
6. **Test offline behavior**: Verify graceful degradation when unreachable
7. **Clean up after tests**: Delete temporary libraries/members post-test
8. **Check available disk space**: Some IBM i test operations need temporary space
9. **Verify user permissions**: Test user must have permissions for member operations
10. **Handle library not found**: Test assumes library exists; add setup if needed

## Running Tests Safely

### 1. Fast Unit Tests (No IBM i Required) — ALWAYS SAFE
```bash
npm run test:unit
```

### 2. All Batched Tests (Mixed Unit + Mocked Integration) — SAFE
```bash
npm run test:batch:all  # Uses sinon mocks, no real IBM i
```

### 3. Real Integration Tests (DANGEROUS — Only with Test VM)
```bash
# First, set environment variables (see above)
export IBM_I_HOST="test-ibmi-vm.local"
export IBM_I_USER="testuser"

# Then run
npm run test:integration
```

### 4. Pre-Commit Verification
```bash
npm run verify:all  # Includes lint, typecheck, i18n check, test suite
```

## Handling Flaky Tests

When IBM i tests fail intermittently:

1. **Increase timeout**: Add `this.timeout(60000)` for specific `it()` blocks
2. **Check IBM i availability**: SSH to test host and verify connectivity
3. **Review test cleanup**: Ensure previous test artifacts aren't interfering
4. **Mock instead of integrating**: Convert to sinon stubs to eliminate flakiness
5. **Check network latency**: IBM i over slow networks may need longer timeouts
6. **Gate on env var**: Ensure test is skipped if test environment isn't configured

## Mocha Configuration Files

```
.mocharc-unit.json            # Fast unit tests only
.mocharc-unit-fast.json       # Subset of unit tests
.mocharc-unit-services.json   # Service layer tests
.mocharc-unit-ui.json         # UI command tests
.mocharc-unit-features.json   # Feature integration tests
```

Batch test commands split the full suite across multiple processes:
- `npm run test:batch:1` (files 1-30)
- `npm run test:batch:2` (files 31-60)
- `npm run test:batch:3` (files 61-90)
- `npm run test:batch:4` (files 91+)
- `npm run test:batch:all` (runs all batches sequentially)

This prevents OOM on large test suites and enables parallel execution in CI.

---

**Related**: See `instructions/lancelot.instructions.md` for IBM i integration architecture and credential handling.
