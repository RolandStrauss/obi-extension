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
exports.lbtSourceDependency = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
const AppConfig_1 = require("./AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const LocalSourceList_1 = require("../../utilities/LocalSourceList");
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
class lbtSourceDependency {
    /**
     * The ComponentGalleryPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        LocalSourceList_1.LocalSourceList.load_source_list();
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
        lbtSourceDependency._context = context;
        lbtSourceDependency._extensionUri = extensionUri;
        lbtSourceDependency.source = source_config;
        if (lbtSourceDependency.currentPanel) {
            lbtSourceDependency.currentPanel.dispose();
        }
        // If a webview panel does not already exist create and show a new one
        const panel = this.createNewPanel(extensionUri);
        panel.webview.html = await lbtSourceDependency.generate_html(extensionUri, panel.webview);
        panel.webview.onDidReceiveMessage(this.onReceiveMessage);
        lbtSourceDependency.currentPanel = new lbtSourceDependency(panel, extensionUri);
    }
    static async generate_html(extensionUri, webview) {
        const source_configs = AppConfig_1.AppConfig.get_source_configs();
        const config = AppConfig_1.AppConfig.get_app_config();
        const ws = Workspace_1.Workspace.get_workspace();
        const source_dir = ws ? path.join(ws, config.general['source-dir'] || 'src') : '';
        let source_config;
        if (source_configs) {
            source_config = source_configs[lbtSourceDependency.source];
        }
        const local_source_list = await LocalSourceList_1.LocalSourceList.get_source_list();
        const dependencies = LBTTools_1.lbtTools.get_dependency_list() || {};
        let dependencies_1 = [];
        let dependencies_2 = [];
        for (const dep of dependencies[lbtSourceDependency.source] || []) {
            dependencies_1.push({ "source": dep, "file": DirTool_1.DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', dep)) });
        }
        for (const [source, deps] of Object.entries(dependencies)) {
            if (deps.includes(lbtSourceDependency.source)) {
                dependencies_2.push({ "source": source, "file": DirTool_1.DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', source)) });
            }
        }
        const html = env.render('source_list/maintain-source-dependency.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webview, extensionUri),
            config_css: (0, getUri_1.getUri)(webview, extensionUri, ["asserts/css", "config.css"]),
            main_java_script: (0, getUri_1.getUri)(webview, extensionUri, ["out", "source_dependency.js"]),
            icons: { debug_start: '$(preview)' },
            src_folder: DirTool_1.DirTool.get_encoded_file_URI(source_dir),
            source: lbtSourceDependency.source,
            source_list: local_source_list,
            dependency_list_1: dependencies_1,
            dependency_list_2: dependencies_2,
            source_file: DirTool_1.DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', lbtSourceDependency.source)),
            source_config_file: DirTool_1.DirTool.get_encoded_file_URI(Constants_1.Constants.LBT_SOURCE_CONFIG_FILE),
            source_config: source_config
        });
        return html;
    }
    static async update() {
        const panel = lbtSourceDependency.currentPanel;
        if (!panel) {
            return;
        }
        panel._panel.webview.html = await lbtSourceDependency.generate_html(lbtSourceDependency._extensionUri, lbtSourceDependency.currentPanel?._panel.webview);
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
            case "add_dependency_1":
                lbtSourceDependency.add_dependency(1, message.source);
                break;
            case "add_dependency_2":
                lbtSourceDependency.add_dependency(2, message.source);
                break;
            case "delete_dependency_1":
                lbtSourceDependency.delete_dependency(1, message.source);
                break;
            case "delete_dependency_2":
                lbtSourceDependency.delete_dependency(2, message.source);
                break;
            case "reload":
                lbtSourceDependency.update();
                break;
        }
        return;
    }
    static add_dependency(type, new_source) {
        let dependency_list = LBTTools_1.lbtTools.get_dependency_list();
        // Add dependency to current source
        if (type == 1) {
            if (!dependency_list[lbtSourceDependency.source]) {
                dependency_list[lbtSourceDependency.source] = [];
            }
            dependency_list[lbtSourceDependency.source].push(new_source);
        }
        // Add current source as dependency to other source
        if (type == 2) {
            if (!dependency_list[new_source]) {
                dependency_list[new_source] = [];
            }
            dependency_list[new_source].push(lbtSourceDependency.source);
        }
        LBTTools_1.lbtTools.save_dependency_list(dependency_list);
    }
    static delete_dependency(type, source) {
        let dependency_list = LBTTools_1.lbtTools.get_dependency_list();
        let key;
        let value;
        if (type == 1) {
            key = lbtSourceDependency.source;
            value = source;
        }
        if (type == 2) {
            key = source;
            value = lbtSourceDependency.source;
        }
        if (dependency_list[key]) {
            const i = dependency_list[key].indexOf(value);
            if (i > -1) {
                dependency_list[key].splice(i, 1);
            }
        }
        LBTTools_1.lbtTools.save_dependency_list(dependency_list);
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('lbt_source_dependency', // Identifies the type of the webview. Used internally
        'lbt source dependency', // Title of the panel displayed to the user
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
        lbtSourceDependency.currentPanel = undefined;
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
exports.lbtSourceDependency = lbtSourceDependency;
