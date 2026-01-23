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
exports.BuildHistoryItem = exports.BuildHistoryProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DirTool_1 = require("../../utilities/DirTool");
const Constants_1 = require("../../Constants");
class BuildHistoryProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = '';
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        if (workspaceRoot !== undefined)
            this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.workspaceRoot) {
            return Promise.resolve([]);
        }
        const build_history_path = path.join(this.workspaceRoot, Constants_1.Constants.BUILD_HISTORY_DIR);
        if (!DirTool_1.DirTool.dir_exists(build_history_path)) {
            return Promise.resolve([]);
        }
        if (element) {
            // Children of a date group
            const build_history_files = DirTool_1.DirTool.list_dir(build_history_path);
            const historyItems = build_history_files
                .map(file => {
                const filePath = path.join(build_history_path, file);
                if (DirTool_1.DirTool.is_file(filePath)) {
                    const stats = fs.statSync(filePath);
                    const fileDate = stats.mtime.toISOString().split('T')[0];
                    if (fileDate === element.label) {
                        return new BuildHistoryItem(stats.mtime.toLocaleTimeString(), vscode.TreeItemCollapsibleState.None, filePath, 'file', file);
                    }
                }
                return null;
            })
                .filter((item) => item !== null)
                .sort((a, b) => b.label.localeCompare(a.label));
            return Promise.resolve(historyItems);
        }
        // Top-level items (date groups)
        const build_history_files = DirTool_1.DirTool.list_dir(build_history_path);
        const dateGroups = new Set();
        build_history_files.forEach(file => {
            const filePath = path.join(build_history_path, file);
            if (DirTool_1.DirTool.is_file(filePath)) {
                const stats = fs.statSync(filePath);
                dateGroups.add(stats.mtime.toISOString().split('T')[0]);
            }
        });
        const sortedDates = Array.from(dateGroups).sort((a, b) => b.localeCompare(a));
        const historyItems = sortedDates.map(date => {
            return new BuildHistoryItem(date, vscode.TreeItemCollapsibleState.Collapsed, '', 'date');
        });
        return Promise.resolve(historyItems);
    }
    async get_child_elements(element) {
        return Promise.resolve([]);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    register(context) {
        // setup
        const options = {
            treeDataProvider: this,
            showCollapseAll: true
        };
        // build
        vscode.window.registerTreeDataProvider('lbt.build-history', this);
        // create
        const tree = vscode.window.createTreeView('lbt.build-history', options);
        vscode.commands.registerCommand('lbt.build-history.update', () => {
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.build-history.delete-item', (item) => {
            if (item && item.file_path && DirTool_1.DirTool.file_exists(item.file_path)) {
                fs.unlinkSync(item.file_path);
                this.refresh();
            }
        });
        vscode.commands.registerCommand('lbt.build-history.delete-date', (item) => {
            const build_history_path = path.join(this.workspaceRoot, Constants_1.Constants.BUILD_HISTORY_DIR);
            if (item && item.date && DirTool_1.DirTool.dir_exists(build_history_path)) {
                const build_history_files = DirTool_1.DirTool.list_dir(build_history_path);
                build_history_files.forEach(file => {
                    const filePath = path.join(build_history_path, file);
                    if (DirTool_1.DirTool.is_file(filePath)) {
                        const stats = fs.statSync(filePath);
                        const fileDate = stats.mtime.toISOString().split('T')[0];
                        if (fileDate === item.date) {
                            fs.unlinkSync(filePath);
                        }
                    }
                });
                this.refresh();
            }
        });
        // subscribe
        context.subscriptions.push(tree);
        const buildHistoryPath = path.join(this.workspaceRoot, Constants_1.Constants.BUILD_HISTORY_DIR, '**/*');
        const watcher = vscode.workspace.createFileSystemWatcher(buildHistoryPath);
        watcher.onDidCreate(() => this.refresh());
        watcher.onDidChange(() => this.refresh());
        watcher.onDidDelete(() => this.refresh());
        context.subscriptions.push(watcher);
    }
}
exports.BuildHistoryProvider = BuildHistoryProvider;
class BuildHistoryItem extends vscode.TreeItem {
    constructor(label, collapsibleState, file_path, type, fileName) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.file_path = file_path;
        if (type === 'date') {
            this.tooltip = `Builds from ${label}`;
            this.contextValue = 'buildHistoryDate';
            this.iconPath = new vscode.ThemeIcon('calendar');
            this.date = label;
        }
        else {
            this.tooltip = `Build history: ${fileName}`;
            this.contextValue = 'buildHistoryFile';
            this.command = {
                command: 'lbt.open_build_summary',
                title: 'Open Build Summary',
                arguments: [this.file_path]
            };
            this.iconPath = new vscode.ThemeIcon('file-text');
        }
    }
}
exports.BuildHistoryItem = BuildHistoryItem;
