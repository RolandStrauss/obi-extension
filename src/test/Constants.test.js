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
const Constants_1 = require("../Constants");
suite('Constants Test Suite', () => {
    test('LBT_DIR - Should be .lbt', () => {
        assert.strictEqual(Constants_1.Constants.LBT_DIR, '.lbt');
    });
    test('LBT_CONFIGS_DIR - Should be .lbt/etc', () => {
        assert.strictEqual(Constants_1.Constants.LBT_CONFIGS_DIR, '.lbt/etc');
    });
    test('SOURCE_FILTER_FOLDER_NAME - Should be .lbt/source-list', () => {
        assert.strictEqual(Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, '.lbt/source-list');
    });
    test('BUILD_OUTPUT_DIR - Should be .lbt/build-output', () => {
        assert.strictEqual(Constants_1.Constants.BUILD_OUTPUT_DIR, '.lbt/build-output');
    });
    test('BUILD_HISTORY_DIR - Should be .lbt/build-history', () => {
        assert.strictEqual(Constants_1.Constants.BUILD_HISTORY_DIR, '.lbt/build-history');
    });
    test('LBT_APP_CONFIG_FILE - Should be .lbt/etc/app-config.toml', () => {
        assert.strictEqual(Constants_1.Constants.LBT_APP_CONFIG_FILE, '.lbt/etc/app-config.toml');
    });
    test('LBT_APP_CONFIG_USER_FILE - Should be .lbt/etc/.user-app-config.toml', () => {
        assert.strictEqual(Constants_1.Constants.LBT_APP_CONFIG_USER_FILE, '.lbt/etc/.user-app-config.toml');
    });
    test('LBT_SOURCE_CONFIG_FILE - Should be .lbt/etc/source-config.toml', () => {
        assert.strictEqual(Constants_1.Constants.LBT_SOURCE_CONFIG_FILE, '.lbt/etc/source-config.toml');
    });
    test('LBT_LOG_FILE - Should be .lbt/log/main.log', () => {
        assert.strictEqual(Constants_1.Constants.LBT_LOG_FILE, '.lbt/log/main.log');
    });
    test('DEPENDENCY_LIST - Should be .lbt/etc/dependency.json', () => {
        assert.strictEqual(Constants_1.Constants.DEPENDENCY_LIST, '.lbt/etc/dependency.json');
    });
    test('COMPILED_OBJECT_LIST - Should be .lbt/etc/object-builds.json', () => {
        assert.strictEqual(Constants_1.Constants.COMPILED_OBJECT_LIST, '.lbt/etc/object-builds.json');
    });
    test('LBT_BACKEND_VERSION - Should be a number', () => {
        assert.strictEqual(typeof Constants_1.Constants.LBT_BACKEND_VERSION, 'number');
        assert.ok(Constants_1.Constants.LBT_BACKEND_VERSION > 0);
    });
    test('HTML_TEMPLATE_DIR - Should contain path to templates', () => {
        assert.ok(Constants_1.Constants.HTML_TEMPLATE_DIR.includes('templates'));
    });
});
