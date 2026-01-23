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
exports.SourceListConfig = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
const AppConfig_1 = require("../controller/AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const SourceListProvider_1 = require("./SourceListProvider");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class SourceListConfig {
    /**
     * The ComponentGalleryPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    static async render(context, source_list_file) {
        const extensionUri = context.extensionUri;
        SourceListConfig._context = context;
        SourceListConfig._extensionUri = extensionUri;
        SourceListConfig.source_list_file = source_list_file;
        if (SourceListConfig.currentPanel) {
            // If the webview panel already exists reveal it
            SourceListConfig.currentPanel._panel.dispose();
        }
        // If a webview panel does not already exist create and show a new one
        const panel = this.createNewPanel(extensionUri);
        panel.webview.html = await SourceListConfig.generate_html(extensionUri, panel.webview);
        panel.webview.onDidReceiveMessage(this.onReceiveMessage);
        SourceListConfig.currentPanel = new SourceListConfig(panel, extensionUri);
    }
    static async generate_html(extensionUri, webview) {
        const config = AppConfig_1.AppConfig.get_app_config();
        const ws = Workspace_1.Workspace.get_workspace();
        const source_list = DirTool_1.DirTool.get_json(path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, SourceListConfig.source_list_file)) || [];
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render('source_list/source-filter-config.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webview, extensionUri),
            config_css: (0, getUri_1.getUri)(webview, extensionUri, ["asserts/css", "config.css"]),
            main_java_script: (0, getUri_1.getUri)(webview, extensionUri, ["out", "source_list_config.js"]),
            source_list: source_list,
            source_list_file: SourceListConfig.source_list_file.replace('.json', ''),
            icons: { trash: "${trash}" }
        });
        return html;
    }
    static async update() {
        const panel = SourceListConfig.currentPanel;
        if (!panel)
            return;
        panel._panel.webview.html = await SourceListConfig.generate_html(SourceListConfig._extensionUri, SourceListConfig.currentPanel?._panel.webview);
        SourceListProvider_1.SourceListProvider.source_list_provider.refresh();
    }
    static onReceiveMessage(message) {
        const config = AppConfig_1.AppConfig.get_app_config();
        const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri
            : undefined;
        if (!workspaceUri)
            return;
        const command = message.command;
        switch (command) {
            case "save_config":
                SourceListConfig.save_filter(message.data);
                SourceListConfig.update();
                break;
            case "delete_filter":
                SourceListConfig.delete_filter(message.lib, message.file, message.member);
                SourceListConfig.update();
                break;
            case "add_filter":
                SourceListConfig.add_filter(message.lib, message.file, message.member, message.regex, message.show_empty_folders || false);
                SourceListConfig.update();
                break;
        }
        return;
    }
    static delete_filter(lib, file, member) {
        const ws = Workspace_1.Workspace.get_workspace();
        const json_file = path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, SourceListConfig.source_list_file);
        const sl = DirTool_1.DirTool.get_json(json_file) || [];
        for (let i = 0; i < sl.length; i++) {
            if (sl[i]['source-lib'] == lib && sl[i]['source-file'] == file && sl[i]['source-member'] == member) {
                sl.splice(i, 1);
                i--;
            }
        }
        DirTool_1.DirTool.write_file(json_file, JSON.stringify(sl, undefined, 2));
    }
    static add_filter(lib, file, member, regex, show_empty_folders) {
        const ws = Workspace_1.Workspace.get_workspace();
        const json_file = path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, SourceListConfig.source_list_file);
        const sl = DirTool_1.DirTool.get_json(json_file) || [];
        // check if it already exist
        for (let i = 0; i < sl.length; i++) {
            if (sl[i]['source-lib'] == lib && sl[i]['source-file'] == file && sl[i]['source-member'] == member) {
                return;
            }
        }
        sl.push({ "source-lib": lib, "source-file": file, "source-member": member, 'use-regex': regex, "show-empty-folders": show_empty_folders });
        DirTool_1.DirTool.write_file(json_file, JSON.stringify(sl, undefined, 2));
    }
    static save_filter(filter) {
        const ws = Workspace_1.Workspace.get_workspace();
        const json_file = path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, SourceListConfig.source_list_file);
        DirTool_1.DirTool.write_file(json_file, JSON.stringify(filter, undefined, 2));
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('lbt_filter_config', // Identifies the type of the webview. Used internally
        'lbt filter config', // Title of the panel displayed to the user
        // The editor column the panel should be displayed in
        vscode_1.ViewColumn.One, 
        // Extra panel configurations
        {
            // Enable JavaScript in the webview
            enableScripts: true,
            enableCommandUris: true,
            enableFindWidget: true,
            // Restrict the webview to only load resources from the `out` directory
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "out"),
                vscode.Uri.joinPath(extensionUri, "asserts")
            ],
            retainContextWhenHidden: true
        });
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        SourceListConfig.currentPanel = undefined;
        // Dispose of the current webview panel
        this._panel.dispose();
        // Dispose of all disposables (i.e. commands) associated with the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
exports.SourceListConfig = SourceListConfig;
