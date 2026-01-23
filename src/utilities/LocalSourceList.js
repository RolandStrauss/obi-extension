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
exports.LocalSourceList = void 0;
const vscode = __importStar(require("vscode"));
const path_1 = __importDefault(require("path"));
const AppConfig_1 = require("../webview/controller/AppConfig");
const Workspace_1 = require("./Workspace");
const DirTool_1 = require("./DirTool");
const Logger_1 = require("./Logger");
class LocalSourceList {
    static async _load_source_list() {
        const config = AppConfig_1.AppConfig.get_app_config();
        const source_dir = path_1.default.join(Workspace_1.Workspace.get_workspace(), config.general['source-dir'] || 'src');
        LocalSourceList.source_list = await DirTool_1.DirTool.get_all_files_in_dir2(source_dir, '.', config.general['supported-object-types'] || ['pgm', 'file', 'srvpgm'], true) || [];
        LocalSourceList.last_load_time = Date.now();
        if (LocalSourceList.watcher_project === undefined) {
            const watch_uri = vscode.Uri.joinPath(Workspace_1.Workspace.get_workspace_uri(), config.general['source-dir'] || 'src');
            Logger_1.logger.debug(`Setting up file watcher for file changes in ${watch_uri}`);
            LocalSourceList.watcher_project = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(watch_uri, '**/*'), false, true, false);
            // File change events
            LocalSourceList.watcher_project.onDidCreate(uri => {
                if (LocalSourceList.watcher_processing_promise.length > 0) {
                    return;
                }
                LocalSourceList.source_loading_promise.push(LocalSourceList.refresh_lbt_stuff(uri));
            });
            LocalSourceList.watcher_project?.onDidDelete(uri => {
                if (LocalSourceList.watcher_processing_promise.length > 0) {
                    return;
                }
                LocalSourceList.source_loading_promise.push(LocalSourceList.refresh_lbt_stuff(uri));
            });
        }
    }
    static async refresh_lbt_stuff(uri) {
        const config = AppConfig_1.AppConfig.get_app_config();
        const ext = uri.fsPath.split('.').pop() ?? '';
        Logger_1.logger.debug(`File changed: ${uri.fsPath}`);
        if (ext == 'log') {
            return;
        }
        Logger_1.logger.debug(`Reload some stuff`);
        await LocalSourceList.load_source_list();
        await vscode.commands.executeCommand("lbt.source-filter.update");
        LocalSourceList.source_loading_promise = [];
    }
    static async load_source_list() {
        if (LocalSourceList.source_loading_promise.length == 0) {
            LocalSourceList.source_loading_promise.push(LocalSourceList._load_source_list());
        }
        await Promise.all(LocalSourceList.source_loading_promise);
        LocalSourceList.source_loading_promise = [];
    }
    static async get_source_list() {
        if (LocalSourceList.source_list === undefined) {
            await LocalSourceList.load_source_list();
        }
        return LocalSourceList.source_list || [];
    }
}
exports.LocalSourceList = LocalSourceList;
LocalSourceList.source_list = undefined;
LocalSourceList.last_load_time = 0;
LocalSourceList.source_loading_promise = [];
LocalSourceList.watcher_project = undefined;
LocalSourceList.watcher_processing_promise = [];
