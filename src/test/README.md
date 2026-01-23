# LBT Extension Test Suite

This directory contains comprehensive test suites for the Lancelot Build Tool (LBT) VS Code extension.

## Test Coverage

### Core Utilities (`/utilities`)
- **DirTool.test.ts** - File system operations, JSON/TOML handling, environment variable resolution
- **Workspace.test.ts** - Workspace management and settings
- **LocaleText.test.ts** - Internationalization and localization
- **getNonce.test.ts** - Security nonce generation for webviews

### Core Components (`/lbt`)
- **Source.test.ts** - Source file data structures and IBM i path conventions
- **LBTStatus.test.ts** - Build status enumeration

### Configuration
- **Constants.test.ts** - Application constants and paths
- **AppConfig.test.ts** - Configuration management (existing)

### Extension Entry Point
- **extension.test.ts** - Extension activation and initialization (existing)

## Running Tests

### Run All Tests
```bash
npm run test
```

### Run Tests in VS Code
1. Open the Debug view (Ctrl+Shift+D)
2. Select "Extension Tests" from the dropdown
3. Press F5 to run tests

### Run Individual Test Files
Use the VS Code Test Explorer to run individual test suites.

## Test Structure

Each test file follows this structure:
```typescript
import * as assert from 'assert';
import { ComponentUnderTest } from '../path/to/component';

suite('Component Test Suite', () => {
    
    setup(() => {
        // Setup before each test
    });

    teardown(() => {
        // Cleanup after each test
    });

    test('Test description', () => {
        // Test implementation
        assert.strictEqual(actual, expected);
    });
});
```

## Test Categories

### Unit Tests
- Test individual functions and classes in isolation
- Mock external dependencies (file system, VS Code API, SSH)
- Focus on logic correctness and edge cases

### Integration Tests (Planned)
- Test component interactions
- Test configuration loading and merging
- Test build orchestration flow

### End-to-End Tests (Planned)
- Test complete workflows
- Test extension commands
- Test UI webview interactions

## Mocking Strategy

### File System Operations
- Use temporary directories for tests that require file operations
- Clean up test artifacts in `teardown()` hooks

### VS Code API
- Mock `vscode.workspace`, `vscode.window`, etc.
- Use test fixtures for workspace folders

### SSH Operations
- Mock SSH connections and command execution
- Use test data for remote responses

## Coverage Goals

- **Target Coverage**: 90%+ code coverage
- **Critical Paths**: 100% coverage for build orchestration, dependency resolution
- **Configuration**: 100% coverage for config parsing and merging
- **Utilities**: 95%+ coverage for file operations, logging, workspace management

## Adding New Tests

When adding new functionality:
1. Create corresponding test file in `/src/test`
2. Follow naming convention: `ComponentName.test.ts`
3. Include setup/teardown for resource management
4. Test both success and error cases
5. Test edge cases and boundary conditions
6. Update this README with new test coverage

## Test Data

Test fixtures and mock data are located in:
- `/src/test/fixtures` (planned)
- Use inline test data for simple cases
- Use fixture files for complex scenarios (TOML configs, JSON responses)

## Dependencies

Test framework: Mocha (VS Code's default test framework)
Assertion library: Node.js built-in `assert` module

## Continuous Integration

Tests are automatically run:
- On every commit (pre-commit hook, planned)
- On pull requests (GitHub Actions, planned)
- Before packaging releases

## Known Issues

- Some tests require a VS Code workspace to be open
- SSH-dependent tests need mocking framework
- Webview tests require headless browser setup (planned)

## Future Enhancements

- [ ] Add integration tests for build process
- [ ] Add SSH mock framework
- [ ] Add webview interaction tests
- [ ] Add performance benchmarks
- [ ] Add code coverage reporting
- [ ] Add snapshot testing for UI components
- [ ] Add mutation testing
