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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = exports.WorkspaceSettings = void 0;
const vscode = __importStar(require("vscode"));
const DirTool_1 = require("./DirTool");
const path_1 = __importDefault(require("path"));
const Constants_1 = require("../Constants");
const Logger_1 = require("./Logger");
class WorkspaceSettings {
}
exports.WorkspaceSettings = WorkspaceSettings;
class Workspace {
    static update_workspace_settings(settings) {
        DirTool_1.DirTool.write_json(path_1.default.join(Workspace.get_workspace_internal(), Constants_1.Constants.LBT_WORKSPACE_SETTINGS_FILE), settings);
    }
    static get_workspace_settings() {
        const result = DirTool_1.DirTool.get_json(path_1.default.join(Workspace.get_workspace_internal(), Constants_1.Constants.LBT_WORKSPACE_SETTINGS_FILE)) ?? {};
        return result;
    }
    static get_workspace_uri() {
        if (!vscode.workspace.workspaceFolders)
            throw new Error('No workspace available');
        return vscode.workspace.workspaceFolders[0].uri;
    }
    /**
     * Internal method that throws if workspace is not available.
     * Use this when a workspace MUST be available.
     */
    static get_workspace_internal() {
        if (!vscode.workspace.workspaceFolders) {
            const err = 'No workspace available';
            Logger_1.logger.error(err);
            throw new Error(err);
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    /**
     * Public method that returns workspace path or undefined.
     * Check for undefined before using in path operations.
     */
    static get_workspace() {
        if (!vscode.workspace.workspaceFolders) {
            Logger_1.logger.error('No workspace available');
            return undefined;
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
}
exports.Workspace = Workspace;
