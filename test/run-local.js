// Run Mocha tests programmatically in Node (uses ts-node inside extensionTests)
const run = require('./extensionTests');

run().then(() => {
  console.log('All tests passed (local run)');
  process.exit(0);
}).catch(err => {
  console.error('Tests failed (local run)', err);
  process.exit(1);
});
