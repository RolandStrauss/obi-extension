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
exports.BuildSummary = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
const path = __importStar(require("path"));
const LogOutput_1 = require("./LogOutput");
const AppConfig_1 = require("../controller/AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const Logger_1 = require("../../utilities/Logger");
const LBTCommands_1 = require("../../lbt/LBTCommands");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class BuildSummary {
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
    static render(extensionUri, workspaceUri, summary_file_path) {
        Logger_1.logger.info('Render BuildSummary');
        BuildSummary._extensionUri = extensionUri;
        BuildSummary._current_compile_list = summary_file_path;
        if (BuildSummary.currentPanel) {
            // If the webview panel already exists reveal it
            BuildSummary.currentPanel._panel.dispose();
        }
        if (!workspaceUri) {
            vscode.window.showErrorMessage("No workspace opened");
            return;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        // If a webview panel does not already exist create and show a new one
        const panel = BuildSummary.createNewPanel(extensionUri);
        panel.webview.html = BuildSummary.generate_html(extensionUri, panel.webview);
        //panel.webview.html = index_html.html;
        panel.webview.onDidReceiveMessage((message) => {
            const command = message.command;
            switch (command) {
                case "hello":
                    vscode.window.showInformationMessage(message.text);
                    return;
                case "show_log":
                    LogOutput_1.LogOutput.render(workspaceUri, message.type, message.level, message.source, message.cmd_index);
                    return;
                case "run_build":
                    LBTCommands_1.lbtCommands.rerun_build(message.ignore_sources, message.ignore_sources_cmd);
                    return;
            }
        });
        BuildSummary.currentPanel = new BuildSummary(panel, extensionUri);
    }
    static get_compile_list() {
        let compile_list;
        const ws = Workspace_1.Workspace.get_workspace();
        if (BuildSummary._current_compile_list && ws) {
            compile_list = DirTool_1.DirTool.get_json(path.join(ws, BuildSummary._current_compile_list));
        }
        else {
            compile_list = LBTTools_1.lbtTools.get_compile_list(Workspace_1.Workspace.get_workspace_uri());
        }
        return compile_list || {};
    }
    static generate_html(extensionUri, webview) {
        const ws = Workspace_1.Workspace.get_workspace_uri();
        const config = AppConfig_1.AppConfig.get_app_config();
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const compile_list = BuildSummary.get_compile_list();
        if (compile_list) {
            for (let level_item of compile_list['compiles']) {
                for (let source of level_item['sources']) {
                    source['file'] = DirTool_1.DirTool.get_encoded_file_URI(path.join(config.general['source-dir'], source['source']));
                }
            }
        }
        let created_timestamp = 'Unsupported timestamp';
        if (compile_list && compile_list['timestamp']) {
            created_timestamp = new Date(compile_list['timestamp']).toLocaleString();
        }
        const html = nunjucks.render('show_changes/index.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webview, extensionUri),
            main_java_script: (0, getUri_1.getUri)(webview, extensionUri, ["out", "show_changes.js"]),
            //filex: encodeURIComponent(JSON.stringify(fileUri)),
            object_list: BuildSummary.get_object_list(ws),
            compile_list: compile_list,
            created_timestamp: created_timestamp,
            compile_file: DirTool_1.DirTool.get_encoded_file_URI(BuildSummary._current_compile_list ?? config.general['compile-list']),
            log_file: DirTool_1.DirTool.get_encoded_file_URI(Constants_1.Constants.LBT_LOG_FILE),
            run_build: !LBTTools_1.lbtTools.is_compile_list_completed(ws),
            ifs_path: config.general['remote-base-dir']
        });
        return html;
    }
    static async update() {
        const panel = BuildSummary.currentPanel;
        if (!panel)
            return;
        panel._panel.webview.html = BuildSummary.generate_html(BuildSummary._extensionUri, BuildSummary.currentPanel?._panel.webview);
    }
    static get_object_list(workspaceUri) {
        const ws = Workspace_1.Workspace.get_workspace();
        const changed_object_list = ws ? path.join(ws, Constants_1.Constants.CHANGED_OBJECT_LIST) : '';
        const dependend_object_list = ws ? path.join(ws, Constants_1.Constants.DEPENDEND_OBJECT_LIST) : '';
        if (!DirTool_1.DirTool.file_exists(changed_object_list) || !DirTool_1.DirTool.file_exists(dependend_object_list)) {
            Logger_1.logger.info(`${changed_object_list}: ${DirTool_1.DirTool.file_exists(changed_object_list)}`);
            Logger_1.logger.info(`${dependend_object_list}: ${DirTool_1.DirTool.file_exists(dependend_object_list)}`);
            return undefined;
        }
        const fs = require("fs");
        let compile_list = fs.readFileSync(changed_object_list);
        // Converting to JSON
        compile_list = JSON.parse(compile_list);
        let dependend_sources = fs.readFileSync(dependend_object_list);
        // Converting to JSON
        dependend_sources = JSON.parse(dependend_sources);
        for (let index = 0; index < compile_list['new-objects'].length; index++) {
            compile_list['new-objects'][index] = { source: compile_list['new-objects'][index], file: DirTool_1.DirTool.get_encoded_source_URI(workspaceUri, compile_list['new-objects'][index]) };
        }
        for (let index = 0; index < compile_list['changed-sources'].length; index++) {
            compile_list['changed-sources'][index] = { source: compile_list['changed-sources'][index], file: DirTool_1.DirTool.get_encoded_source_URI(workspaceUri, compile_list['changed-sources'][index]) };
        }
        for (let index = 0; index < dependend_sources.length; index++) {
            dependend_sources[index] = { source: dependend_sources[index], file: DirTool_1.DirTool.get_encoded_source_URI(workspaceUri, dependend_sources[index]) };
        }
        Logger_1.logger.info(`compile_list['new-objects']: ${compile_list['new-objects'].length}`);
        Logger_1.logger.info(`compile_list['changed-sources']: ${compile_list['changed-sources'].length}`);
        return {
            new_sources: compile_list['new-objects'],
            changed_sources: compile_list['changed-sources'],
            dependend_sources: dependend_sources
        };
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('show_changes', // Identifies the type of the webview. Used internally
        'Build summary', // Title of the panel displayed to the user
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
        BuildSummary.currentPanel = undefined;
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
exports.BuildSummary = BuildSummary;
