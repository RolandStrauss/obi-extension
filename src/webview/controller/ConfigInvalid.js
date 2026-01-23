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
exports.ConfigInvalid = void 0;
const vscode = __importStar(require("vscode"));
const getUri_1 = require("../../utilities/getUri");
const LBTTools_1 = require("../../utilities/LBTTools");
const Constants_1 = require("../../Constants");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class ConfigInvalid {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        this._context = context;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "out"),
                vscode.Uri.joinPath(this._extensionUri, "asserts")
            ]
        };
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('No workspace defined');
            return;
        }
        const html_template = 'controller/config_invalid.html';
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render(html_template, {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webviewView.webview, this._extensionUri),
            main_java_script: (0, getUri_1.getUri)(webviewView.webview, this._extensionUri, ["out", "config_invalid.js"])
        });
        webviewView.webview.html = html;
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'initialize_folder':
                    {
                        LBTTools_1.lbtTools.initialize_folder();
                        break;
                    }
                case 'reload_workspace':
                    {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                        break;
                    }
                case 'config':
                    {
                        vscode.commands.executeCommand('lbt.controller.config');
                        break;
                    }
            }
        });
    }
}
exports.ConfigInvalid = ConfigInvalid;
ConfigInvalid.viewType = 'lbt-config-invalid';
