import * as assert from 'assert';
import type { ISource } from '../lbt/Source';

suite('Source Test Suite', () => {

  test('ISource interface - Should be importable as type', () => {
    // This test verifies the interface can be imported and used as a type
    const source: ISource = {
      TESTLIB: 'pgm'
    };

    assert.ok(typeof source === 'object');
    assert.ok('TESTLIB' in source);
  });

  test('ISource interface - Should support string key-value pairs', () => {
    const source: ISource = {
      MYLIB: 'pgm',
      YOURLIB: 'module'
    };

    assert.strictEqual(source.MYLIB, 'pgm');
    assert.strictEqual(source.YOURLIB, 'module');
  });

  test('ISource interface - Should allow dynamic keys', () => {
    const source: ISource = {};
    const key = 'DYNAMICKEY';
    source[key] = 'value';

    assert.strictEqual(source[key], 'value');
    assert.ok(key in source);
  });

  test('ISource interface - Should work with object keys', () => {
    const source: ISource = {
      'key1': 'value1',
      'key2': 'value2'
    };

    assert.strictEqual(Object.keys(source).length, 2);
    assert.ok('key1' in source);
    assert.ok('key2' in source);
  });
});
