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
exports.I_Releaser = void 0;
const vscode = __importStar(require("vscode"));
const getUri_1 = require("../../utilities/getUri");
const LBTTools_1 = require("../../utilities/LBTTools");
const Constants_1 = require("../../Constants");
const DeploymentConfig = __importStar(require("./DeploymentConfig"));
const Logger_1 = require("../../utilities/Logger");
const nunjucks = require('nunjucks');
class I_Releaser {
    constructor(extensionUri) {
        I_Releaser._extensionUri = extensionUri;
        I_Releaser.i_releaser = this;
    }
    async resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        this._context = context;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [
                vscode.Uri.joinPath(I_Releaser._extensionUri, "out"),
                vscode.Uri.joinPath(I_Releaser._extensionUri, "asserts")
            ]
        };
        webviewView.webview.html = await I_Releaser.getHTML(webviewView);
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'open_web_app':
                    {
                        vscode.commands.executeCommand('workbench.action.openRecent');
                        break;
                    }
            }
        });
    }
    static async getHTML(webviewView) {
        const html_template = 'deployment/i-releaser.html';
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render(html_template, {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webviewView.webview, this._extensionUri),
            main_java_script: (0, getUri_1.getUri)(webviewView.webview, this._extensionUri, ["out", "i_releaser.js"]),
            workspace_exist: vscode.workspace.workspaceFolders != undefined,
            config: DeploymentConfig.DeploymentConfig.get_deployment_config(),
            workflows: await I_Releaser.get_workflows()
        });
        return html;
    }
    static async refresh() {
        const i_releaser = I_Releaser.i_releaser;
        if (i_releaser._view)
            i_releaser._view.webview.html = await this.getHTML(i_releaser._view);
    }
    static async get_workflows() {
        const config = DeploymentConfig.DeploymentConfig.get_deployment_config();
        if (!config['i-releaser'].url) {
            vscode.window.showWarningMessage('Missing deployment config');
            return {};
        }
        const auth_token = await LBTTools_1.lbtTools.ext_context.secrets.get(`lbt|deployment|http_auth_token`);
        if (!auth_token) {
            vscode.window.showErrorMessage('Missing HTTP auth token for i-Releaser. Please check the config');
            return {};
        }
        try {
            const response = await fetch(`${config['i-releaser'].url}/api/get_workflows?auth-token=${auth_token}`);
            const data = await response.json();
            if (data['Error']) {
                throw Error(`i-Releaser: ${data['Error']}`);
            }
            return data;
        }
        catch (e) {
            Logger_1.logger.error(e, e.stack);
            vscode.window.showErrorMessage(`i-Releaser error: ${e.message}`);
        }
        return {};
    }
}
exports.I_Releaser = I_Releaser;
I_Releaser.viewType = 'lbt.deployment';
