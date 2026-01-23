import * as assert from 'assert';
import { lbtStatus } from '../lbt/LBTStatus';

suite('lbtStatus Test Suite', () => {

  test('lbtStatus enum - Should have IN_PROCESS value', () => {
    assert.ok('IN_PROCESS' in lbtStatus);
  });

  test('lbtStatus enum - Should have READY value', () => {
    assert.ok('READY' in lbtStatus);
  });

  test('lbtStatus enum - Should have correct string values', () => {
    // Verify that enum values are defined and accessible
    const inProcessValue = lbtStatus.IN_PROCESS;
    const readyValue = lbtStatus.READY;

    assert.notStrictEqual(inProcessValue, undefined);
    assert.notStrictEqual(readyValue, undefined);
  });

  test('lbtStatus enum - Values should be distinct', () => {
    const values = [
      lbtStatus.IN_PROCESS,
      lbtStatus.READY
    ];

    const uniqueValues = new Set(values);
    assert.strictEqual(uniqueValues.size, values.length, 'All enum values should be distinct');
  });
});
