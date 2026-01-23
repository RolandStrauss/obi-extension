"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webview_ui_toolkit_1 = require("@vscode/webview-ui-toolkit");
// In order to use all the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
(0, webview_ui_toolkit_1.provideVSCodeDesignSystem)().register(webview_ui_toolkit_1.allComponents);
const vscode = acquireVsCodeApi();
window.addEventListener("load", main);
function main() {
    // To get improved type annotations/IntelliSense the associated class for
    // a given toolkit component can be imported and used to type cast a reference
    // to the element (i.e. the `as Button` syntax)
    const btn_initialize_folder = document.getElementById("initialize_folder");
    btn_initialize_folder?.addEventListener("click", initialize_folder);
    const btn_reload_workspace = document.getElementById("reload_workspace");
    btn_reload_workspace?.addEventListener("click", reload_workspace);
    const btn_config = document.getElementById("config");
    btn_config?.addEventListener("click", config);
    window.addEventListener('message', receive_message);
}
function config() {
    vscode.postMessage({
        command: "config"
    });
}
function initialize_folder() {
    vscode.postMessage({
        command: "initialize_folder"
    });
}
function reload_workspace() {
    vscode.postMessage({
        command: "reload_workspace"
    });
}
function receive_message(e) {
    switch (e.data.command) {
        case '':
            break;
    }
}
