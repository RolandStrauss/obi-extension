// This file is executed inside the test extension host and must run the test framework (mocha).
require('ts-node').register({ transpileOnly: true });
require('source-map-support').install();

const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

function collectTests(dir) {
  const files = fs.readdirSync(dir);
  let tests = [];
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      tests = tests.concat(collectTests(full));
    } else if (f.endsWith('.test.ts') || f.endsWith('.test.js')) {
      tests.push(full);
    }
  }
  return tests;
}

async function run() {
  const mocha = new Mocha({ timeout: 60000 });
  // Use TDD interface (suite/test) which some tests expect
  mocha.ui('tdd');
  const tests = collectTests(path.resolve(__dirname, '..', 'src', 'test'));
  for (const t of tests) {
    mocha.addFile(t);
  }

  return new Promise((resolve, reject) => {
    mocha.run(failures => {
      if (failures) {
        reject(new Error(`Tests failed: ${failures}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = run;
