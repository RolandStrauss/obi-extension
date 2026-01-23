"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const getNonce_1 = require("../utilities/getNonce");
suite('getNonce Test Suite', () => {
    test('getNonce - Should return a string', () => {
        const nonce = (0, getNonce_1.getNonce)();
        assert.strictEqual(typeof nonce, 'string');
    });
    test('getNonce - Should return non-empty string', () => {
        const nonce = (0, getNonce_1.getNonce)();
        assert.ok(nonce.length > 0);
    });
    test('getNonce - Should return expected length (32 characters)', () => {
        const nonce = (0, getNonce_1.getNonce)();
        // Nonce should be 32 characters (16 random bytes as hex)
        assert.strictEqual(nonce.length, 32);
    });
    test('getNonce - Should return unique values', () => {
        const nonce1 = (0, getNonce_1.getNonce)();
        const nonce2 = (0, getNonce_1.getNonce)();
        assert.notStrictEqual(nonce1, nonce2, 'Each call should return a unique nonce');
    });
    test('getNonce - Should contain only valid hex characters', () => {
        const nonce = (0, getNonce_1.getNonce)();
        const hexPattern = /^[0-9a-f]+$/;
        assert.ok(hexPattern.test(nonce), 'Nonce should contain only hex characters');
    });
    test('getNonce - Multiple calls should return different values', () => {
        const nonces = new Set();
        const iterations = 100;
        for (let i = 0; i < iterations; i++) {
            nonces.add((0, getNonce_1.getNonce)());
        }
        assert.strictEqual(nonces.size, iterations, 'All nonces should be unique');
    });
});
