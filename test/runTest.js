const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '..');
    // Use compiled test runner under out/test/runTest.js which the harness expects
    const extensionTestsPath = path.resolve(extensionDevelopmentPath, 'out', 'test', 'simpleRunner.js');

    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  }
  catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();
