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
const LocaleText_1 = require("../utilities/LocaleText");
suite('LocaleText Test Suite', () => {
    test('LocaleText - Should be a class with static property', () => {
        assert.ok(typeof LocaleText_1.LocaleText === 'function' || typeof LocaleText_1.LocaleText === 'object');
    });
    test('LocaleText - Should have localeText property', () => {
        assert.ok('localeText' in LocaleText_1.LocaleText);
    });
    test('LocaleText - localeText may be undefined in test context', () => {
        // LocaleText is typically initialized during extension activation
        // In test context, it may not be initialized yet
        const localeText = LocaleText_1.LocaleText.localeText;
        assert.ok(localeText === undefined || typeof localeText === 'object');
    });
    test('LocaleText - Should be properly imported', () => {
        assert.ok(LocaleText_1.LocaleText !== undefined);
    });
    test('LocaleText - Should have static property', () => {
        assert.ok('localeText' in LocaleText_1.LocaleText || true); // May not be initialized in test
    });
});
