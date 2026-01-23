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
    const btn_initialize_folder = document.getElementById("open_web_app");
    btn_initialize_folder?.addEventListener("click", open_web_app);
    window.addEventListener('message', receive_message);
}
function open_web_app() {
    vscode.postMessage({
        command: "open_web_app"
    });
}
function receive_message(e) {
    switch (e.data.command) {
        case '':
            break;
    }
}
