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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const DirTool_1 = require("../utilities/DirTool");
suite('DirTool Test Suite', () => {
    let testDir;
    setup(() => {
        // Create a temporary test directory
        testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lbt-test-'));
    });
    teardown(() => {
        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });
    test('resolve_env_in_path - Unix style', () => {
        process.env.TEST_VAR = 'test_value';
        const result = DirTool_1.DirTool.resolve_env_in_path('/home/$TEST_VAR/path');
        assert.strictEqual(result, '/home/test_value/path');
        delete process.env.TEST_VAR;
    });
    test('resolve_env_in_path - Windows style', () => {
        process.env.TEST_VAR = 'test_value';
        const result = DirTool_1.DirTool.resolve_env_in_path('C:\\Users\\%TEST_VAR%\\path');
        assert.strictEqual(result, 'C:\\Users\\test_value\\path');
        delete process.env.TEST_VAR;
    });
    test('resolve_env_in_path - No environment variables', () => {
        const result = DirTool_1.DirTool.resolve_env_in_path('/home/user/path');
        assert.strictEqual(result, '/home/user/path');
    });
    test('dir_exists - Should return true for existing directory', () => {
        const result = DirTool_1.DirTool.dir_exists(testDir);
        assert.strictEqual(result, true);
    });
    test('dir_exists - Should return false for non-existing directory', () => {
        const result = DirTool_1.DirTool.dir_exists(path.join(testDir, 'nonexistent'));
        assert.strictEqual(result, false);
    });
    test('file_exists - Should return true for existing file', () => {
        const testFile = path.join(testDir, 'test.txt');
        fs.writeFileSync(testFile, 'test content');
        const result = DirTool_1.DirTool.file_exists(testFile);
        assert.strictEqual(result, true);
    });
    test('file_exists - Should return false for non-existing file', () => {
        const result = DirTool_1.DirTool.file_exists(path.join(testDir, 'nonexistent.txt'));
        assert.strictEqual(result, false);
    });
    test('write_json and get_json - Should write and retrieve JSON correctly', () => {
        const testFile = path.join(testDir, 'test.json');
        const testData = { key: 'value', number: 42, nested: { prop: 'nested value' } };
        DirTool_1.DirTool.write_json(testFile, testData);
        const result = DirTool_1.DirTool.get_json(testFile);
        assert.deepStrictEqual(result, testData);
    });
    test('get_json - Should return default value for non-existing file', () => {
        const result = DirTool_1.DirTool.get_json(path.join(testDir, 'nonexistent.json'));
        assert.strictEqual(result, null);
    });
    test('get_all_files_in_dir - Should find all files with specified extensions', () => {
        // Create test structure
        fs.mkdirSync(path.join(testDir, 'subdir'));
        fs.writeFileSync(path.join(testDir, 'file1.ts'), '');
        fs.writeFileSync(path.join(testDir, 'file2.js'), '');
        fs.writeFileSync(path.join(testDir, 'file3.txt'), '');
        fs.writeFileSync(path.join(testDir, 'subdir', 'file4.ts'), '');
        const files = Array.from(DirTool_1.DirTool.get_all_files_in_dir(testDir, '', ['ts']) || []);
        assert.strictEqual(files.length, 2);
        assert.ok(files.some(f => f.includes('file1.ts')));
        assert.ok(files.some(f => f.includes('file4.ts')));
    });
    test('get_all_files_in_dir - Should return undefined for non-existing directory', () => {
        const result = DirTool_1.DirTool.get_all_files_in_dir(testDir, 'nonexistent', ['ts']);
        assert.strictEqual(result, undefined);
    });
});
