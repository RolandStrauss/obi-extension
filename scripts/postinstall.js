const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'ssh2', 'test');

try {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  }
} catch (err) {
  // Do not fail the install if removal fails
  console.error(`Failed to remove ${target}:`, err.message);
}
