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
exports.DeploymentConfig = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
const Workspace_1 = require("../../utilities/Workspace");
const I_Releaser_1 = require("./I_Releaser");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class DeploymentConfig {
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
    static async render(context) {
        DeploymentConfig._context = context;
        DeploymentConfig._extensionUri = context.extensionUri;
        if (DeploymentConfig.currentPanel) {
            // If the webview panel already exists reveal it
            DeploymentConfig.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
            return;
        }
        // If a webview panel does not already exist create and show a new one
        const panel = this.createNewPanel(context.extensionUri);
        panel.webview.html = await DeploymentConfig.generate_html(context, context.extensionUri, panel.webview);
        panel.webview.onDidReceiveMessage(this.onReceiveMessage);
        DeploymentConfig.currentPanel = new DeploymentConfig(panel, context.extensionUri);
    }
    static get_deployment_config() {
        const ws = Workspace_1.Workspace.get_workspace();
        const toml_file = path.join(ws || '', Constants_1.Constants.DEPLOYMENT_CONFIG_FILE);
        const config = DirTool_1.DirTool.get_toml(toml_file);
        if (!config) {
            return { "i-releaser": {} };
        }
        return config;
    }
    static async generate_html(context, extensionUri, webview) {
        const config = DeploymentConfig.get_deployment_config();
        const auth_token = await context.secrets.get(`lbt|deployment|http_auth_token`);
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render('deployment/deployment-config.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webview, extensionUri),
            config_css: (0, getUri_1.getUri)(webview, extensionUri, ["asserts/css", "config.css"]),
            main_java_script: (0, getUri_1.getUri)(webview, extensionUri, ["out", "deployment_config.js"]),
            auth_token: auth_token,
            deploy_config: config
        });
        return html;
    }
    static async update() {
        const panel = DeploymentConfig.currentPanel;
        if (!panel)
            return;
        panel._panel.webview.html = await DeploymentConfig.generate_html(DeploymentConfig._context, DeploymentConfig._extensionUri, DeploymentConfig.currentPanel?._panel.webview);
    }
    static onReceiveMessage(message) {
        const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri
            : undefined;
        if (!workspaceUri)
            return;
        const command = message.command;
        switch (command) {
            case "save":
                DeploymentConfig.save_config(message.data);
                break;
            case "reload":
                DeploymentConfig.update();
                break;
        }
        return;
    }
    static save_config(data) {
        const ws = Workspace_1.Workspace.get_workspace();
        const toml_file = path.join(ws || '', Constants_1.Constants.DEPLOYMENT_CONFIG_FILE);
        data['i-releaser']['auth-token'];
        LBTTools_1.lbtTools.ext_context.secrets.store('lbt|deployment|http_auth_token', data['i-releaser']['auth-token'] || '');
        delete data['i-releaser']['auth-token'];
        DirTool_1.DirTool.write_toml(toml_file, data);
        I_Releaser_1.I_Releaser.refresh();
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('lbt_deployment_config', // Identifies the type of the webview. Used internally
        'i-Releaser config', // Title of the panel displayed to the user
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
        DeploymentConfig.currentPanel = undefined;
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
exports.DeploymentConfig = DeploymentConfig;
