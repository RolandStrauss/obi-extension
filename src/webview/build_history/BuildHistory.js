"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildHistory = void 0;
const LBTCommands_1 = require("../../lbt/LBTCommands");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class BuildHistory {
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
        this._panel.onDidDispose(this.dispose, this, this._disposables);
        panel.webview.onDidReceiveMessage((message) => {
            const command = message.command;
            switch (command) {
                case "show_build_summary":
                    LBTCommands_1.lbtCommands.show_build_summary(message.file);
                    return;
                case "delete_item":
                    LBTCommands_1.lbtCommands.delete_compile_list_item(message.level, message.source);
                    BuildHistory.update();
                    return;
                case "delete_level":
                    LBTCommands_1.lbtCommands.delete_compile_list_level(message.level);
                    BuildHistory.update();
                    return;
            }
        });
        BuildHistory.currentPanel = new BuildHistory(panel, extensionUri);
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        BuildHistory.currentPanel = undefined;
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
    /**
     * Updates the build history panel display
     */
    static update() {
        // Refresh the current panel if it exists
        if (BuildHistory.currentPanel) {
            // Placeholder for update logic - can be expanded later
            // to refresh the webview content from the build history
        }
    }
}
exports.BuildHistory = BuildHistory;
