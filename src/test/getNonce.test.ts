import * as assert from 'assert';
import { getNonce } from '../utilities/getNonce';

suite('getNonce Test Suite', () => {

	test('getNonce - Should return a string', () => {
		const nonce = getNonce();
		assert.strictEqual(typeof nonce, 'string');
	});

	test('getNonce - Should return non-empty string', () => {
		const nonce = getNonce();
		assert.ok(nonce.length > 0);
	});

	test('getNonce - Should return expected length (32 characters)', () => {
		const nonce = getNonce();
		// Nonce should be 32 characters (16 random bytes as hex)
		assert.strictEqual(nonce.length, 32);
	});

	test('getNonce - Should return unique values', () => {
		const nonce1 = getNonce();
		const nonce2 = getNonce();
		assert.notStrictEqual(nonce1, nonce2, 'Each call should return a unique nonce');
	});

	test('getNonce - Should contain only valid hex characters', () => {
		const nonce = getNonce();
		const hexPattern = /^[0-9a-f]+$/;
		assert.ok(hexPattern.test(nonce), 'Nonce should contain only hex characters');
	});

	test('getNonce - Multiple calls should return different values', () => {
		const nonces = new Set<string>();
		const iterations = 100;

		for (let i = 0; i < iterations; i++) {
			nonces.add(getNonce());
		}

		assert.strictEqual(nonces.size, iterations, 'All nonces should be unique');
	});
});
