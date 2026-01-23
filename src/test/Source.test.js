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
suite('Source Test Suite', () => {
    test('ISource interface - Should be importable as type', () => {
        // This test verifies the interface can be imported and used as a type
        const source = {
            TESTLIB: 'pgm'
        };
        assert.ok(typeof source === 'object');
        assert.ok('TESTLIB' in source);
    });
    test('ISource interface - Should support string key-value pairs', () => {
        const source = {
            MYLIB: 'pgm',
            YOURLIB: 'module'
        };
        assert.strictEqual(source.MYLIB, 'pgm');
        assert.strictEqual(source.YOURLIB, 'module');
    });
    test('ISource interface - Should allow dynamic keys', () => {
        const source = {};
        const key = 'DYNAMICKEY';
        source[key] = 'value';
        assert.strictEqual(source[key], 'value');
        assert.ok(key in source);
    });
    test('ISource interface - Should work with object keys', () => {
        const source = {
            'key1': 'value1',
            'key2': 'value2'
        };
        assert.strictEqual(Object.keys(source).length, 2);
        assert.ok('key1' in source);
        assert.ok('key2' in source);
    });
});
