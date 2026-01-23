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
exports.lbtConfiguration = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
const AppConfig_1 = require("./AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
// configure() returns an Environment
const env = nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
// Register "typename" filter on the environment
env.addFilter("typename", (obj) => {
    if (obj === null) {
        return "null";
    }
    if (obj === undefined) {
        return "undefined";
    }
    // If it's a class instance or built-in
    if (obj.constructor && obj.constructor.name) {
        return obj.constructor.name;
    }
    // Fallback
    return typeof obj;
});
class lbtConfiguration {
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
    static async render(context, extensionUri, source_config) {
        lbtConfiguration._context = context;
        lbtConfiguration._extensionUri = extensionUri;
        lbtConfiguration.source_config = LBTTools_1.lbtTools.convert_local_filepath_2_lbt_filepath(source_config);
        if (lbtConfiguration.currentPanel) {
            lbtConfiguration.currentPanel.dispose();
        }
        // If a webview panel does not already exist create and show a new one
        const panel = this.createNewPanel(extensionUri);
        panel.webview.html = await lbtConfiguration.generate_html(extensionUri, panel.webview);
        panel.webview.onDidReceiveMessage(this.onReceiveMessage);
        lbtConfiguration.currentPanel = new lbtConfiguration(panel, extensionUri);
    }
    static async generate_html(extensionUri, webview) {
        const source_configs = AppConfig_1.AppConfig.get_source_configs();
        const config = AppConfig_1.AppConfig.get_app_config();
        let source_config;
        if (source_configs) {
            source_config = source_configs[lbtConfiguration.source_config];
        }
        const html = env.render('controller/config_source_details.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webview, extensionUri),
            config_css: (0, getUri_1.getUri)(webview, extensionUri, ["asserts/css", "config.css"]),
            main_java_script: (0, getUri_1.getUri)(webview, extensionUri, ["out", "source_config.js"]),
            icons: { debug_start: '$(preview)' },
            source: lbtConfiguration.source_config,
            source_file: DirTool_1.DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', lbtConfiguration.source_config)),
            source_config_file: DirTool_1.DirTool.get_encoded_file_URI(Constants_1.Constants.LBT_SOURCE_CONFIG_FILE),
            source_config: source_config
        });
        return html;
    }
    static async update() {
        const panel = lbtConfiguration.currentPanel;
        if (!panel) {
            return;
        }
        panel._panel.webview.html = await lbtConfiguration.generate_html(lbtConfiguration._extensionUri, lbtConfiguration.currentPanel?._panel.webview);
    }
    static onReceiveMessage(message) {
        const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri
            : undefined;
        if (!workspaceUri) {
            return;
        }
        const command = message.command;
        switch (command) {
            case "add_source_cmd":
                lbtConfiguration.add_source_cmd(message.key, message.value);
                break;
            case "delete_source_cmd":
                lbtConfiguration.delete_source_cmd(message.key);
                break;
            case "add_source_setting":
                switch (message.type) {
                    case "list":
                        message.value = message.value.split(/\r?\n/);
                        break;
                }
                lbtConfiguration.add_source_setting(message.key, message.value);
                break;
            case "delete_source_setting":
                lbtConfiguration.delete_source_setting(message.key);
                break;
            case "save_config":
                lbtConfiguration.save_config(message.settings, message.source_cmds, message.steps);
                break;
            case "reload":
                lbtConfiguration.update();
                break;
        }
        return;
    }
    static delete_source_setting(key) {
        let source_configs = AppConfig_1.AppConfig.get_source_configs();
        const source_name = lbtConfiguration.source_config;
        const ws = Workspace_1.Workspace.get_workspace();
        if (source_configs && source_configs[source_name] && source_configs[source_name].settings) {
            delete source_configs[source_name].settings[key];
        }
        DirTool_1.DirTool.write_toml(path.join(ws || '', Constants_1.Constants.LBT_SOURCE_CONFIG_FILE), source_configs || {});
    }
    static delete_source_cmd(key) {
        let source_configs = AppConfig_1.AppConfig.get_source_configs();
        const source_name = lbtConfiguration.source_config;
        const ws = Workspace_1.Workspace.get_workspace();
        if (source_configs && source_configs[source_name] && source_configs[source_name]['source-cmds']) {
            delete source_configs[source_name]['source-cmds'][key];
        }
        DirTool_1.DirTool.write_toml(path.join(ws || '', Constants_1.Constants.LBT_SOURCE_CONFIG_FILE), source_configs || {});
    }
    static add_source_cmd(key, value) {
        let source_configs = AppConfig_1.AppConfig.get_source_configs();
        let source_config = { "source-cmds": { key: value }, settings: {}, steps: [] };
        const source_name = lbtConfiguration.source_config;
        const ws = Workspace_1.Workspace.get_workspace();
        if (!source_configs || !source_configs[source_name]) {
            source_configs = { source_name: source_config };
        }
        else {
            if (!source_configs[source_name]['source-cmds']) {
                source_configs[source_name]['source-cmds'] = {};
            }
            source_configs[source_name]['source-cmds'][key] = value;
        }
        DirTool_1.DirTool.write_toml(path.join(ws || '', Constants_1.Constants.LBT_SOURCE_CONFIG_FILE), source_configs);
    }
    static add_source_setting(key, value) {
        let source_configs = AppConfig_1.AppConfig.get_source_configs();
        let source_config = { "source-cmds": {}, settings: { key: value }, steps: [] };
        const source_name = lbtConfiguration.source_config;
        const ws = Workspace_1.Workspace.get_workspace();
        if (!source_configs || !source_configs[source_name]) {
            source_configs = { source_name: source_config };
        }
        else {
            if (!source_configs[source_name].settings) {
                source_configs[source_name].settings = {};
            }
            source_configs[source_name].settings[key] = value;
        }
        DirTool_1.DirTool.write_toml(path.join(ws || '', Constants_1.Constants.LBT_SOURCE_CONFIG_FILE), source_configs);
    }
    static save_config(settings, source_cmds, steps) {
        let source_configs = AppConfig_1.AppConfig.get_source_configs();
        let source_config = { "source-cmds": source_cmds, settings: settings, steps: steps };
        const source_name = lbtConfiguration.source_config;
        const ws = Workspace_1.Workspace.get_workspace();
        if (!source_configs) {
            source_configs = { source_name: source_config };
        }
        else {
            source_configs[source_name] = source_config;
        }
        DirTool_1.DirTool.write_toml(path.join(ws || '', Constants_1.Constants.LBT_SOURCE_CONFIG_FILE), source_configs);
        vscode.window.showInformationMessage('Source configuration saved');
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('lbt_source_config', // Identifies the type of the webview. Used internally
        'lbt source config', // Title of the panel displayed to the user
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
        lbtConfiguration.currentPanel = undefined;
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
exports.lbtConfiguration = lbtConfiguration;
