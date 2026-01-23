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
const LBTStatus_1 = require("../lbt/LBTStatus");
suite('lbtStatus Test Suite', () => {
    test('lbtStatus enum - Should have IN_PROCESS value', () => {
        assert.ok('IN_PROCESS' in LBTStatus_1.lbtStatus);
    });
    test('lbtStatus enum - Should have READY value', () => {
        assert.ok('READY' in LBTStatus_1.lbtStatus);
    });
    test('lbtStatus enum - Should have correct string values', () => {
        // Verify that enum values are defined and accessible
        const inProcessValue = LBTStatus_1.lbtStatus.IN_PROCESS;
        const readyValue = LBTStatus_1.lbtStatus.READY;
        assert.notStrictEqual(inProcessValue, undefined);
        assert.notStrictEqual(readyValue, undefined);
    });
    test('lbtStatus enum - Values should be distinct', () => {
        const values = [
            LBTStatus_1.lbtStatus.IN_PROCESS,
            LBTStatus_1.lbtStatus.READY
        ];
        const uniqueValues = new Set(values);
        assert.strictEqual(uniqueValues.size, values.length, 'All enum values should be distinct');
    });
});
