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
exports.SourceList = void 0;
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const LBTTools_1 = require("../../utilities/LBTTools");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class SourceList {
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
    static async render(extensionUri, workspaceUri, source_list_file) {
        if (SourceList.currentPanel) {
            // If the webview panel already exists reveal it
            SourceList.currentPanel._panel.dispose();
        }
        let filtered_sources_extended = await LBTTools_1.lbtTools.get_filtered_sources_with_details(source_list_file) || [];
        for (let source of filtered_sources_extended) {
            source['path'] = DirTool_1.DirTool.get_encoded_source_URI(workspaceUri, path.join(source['source-lib'], source['source-file'], source['source-member']));
        }
        // If a webview panel does not already exist create and show a new one
        const panel = this.createNewPanel(extensionUri);
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render('source_list/index.html', {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(panel.webview, extensionUri),
            main_java_script: (0, getUri_1.getUri)(panel.webview, extensionUri, ["out", "webview.js"]),
            source_list: filtered_sources_extended,
            source_list_file: source_list_file
            //filex: encodeURIComponent(JSON.stringify(fileUri)),
            //object_list: this.get_object_list(workspaceUri),
            //compile_list: this.get_compile_list(workspaceUri)
        });
        panel.webview.html = html;
        //panel.webview.html = index_html.html;
        panel.webview.onDidReceiveMessage((message) => {
            const command = message.command;
            const text = message.text;
            switch (command) {
                case "hello":
                    vscode.window.showInformationMessage(text);
                    return;
            }
        });
        SourceList.currentPanel = new SourceList(panel, extensionUri);
    }
    static createNewPanel(extensionUri) {
        return vscode_1.window.createWebviewPanel('source_list', // Identifies the type of the webview. Used internally
        'Source list', // Title of the panel displayed to the user
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
        });
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        SourceList.currentPanel = undefined;
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
exports.SourceList = SourceList;
