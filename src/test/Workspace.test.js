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
const vscode = __importStar(require("vscode"));
const Workspace_1 = require("../utilities/Workspace");
suite('Workspace Test Suite', () => {
    test('WorkspaceSettings - Should create empty object', () => {
        const settings = {};
        assert.strictEqual(typeof settings, 'object');
    });
    test('WorkspaceSettings - Should store current_profile', () => {
        const settings = {
            current_profile: 'test_profile'
        };
        assert.strictEqual(settings.current_profile, 'test_profile');
    });
    test('get_workspace - Should return undefined when no workspace is open', () => {
        // This test will pass only when no workspace is open
        // In actual extension environment with workspace, it should return a path
        if (!vscode.workspace.workspaceFolders) {
            const workspace = Workspace_1.Workspace.get_workspace();
            assert.strictEqual(workspace, undefined);
        }
        else {
            // If workspace is open, verify it returns a string
            const workspace = Workspace_1.Workspace.get_workspace();
            assert.strictEqual(typeof workspace, 'string');
        }
    });
    test('get_workspace_uri - Should throw when no workspace is available', () => {
        if (!vscode.workspace.workspaceFolders) {
            assert.throws(() => {
                Workspace_1.Workspace.get_workspace_uri();
            }, Error);
        }
        else {
            // If workspace is open, verify it returns a Uri
            const uri = Workspace_1.Workspace.get_workspace_uri();
            assert.ok(uri instanceof vscode.Uri);
        }
    });
});
