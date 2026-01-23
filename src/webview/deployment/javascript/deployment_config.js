"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webview_ui_toolkit_1 = require("@vscode/webview-ui-toolkit");
const alertBox_1 = require("../../tools/javascript/alertBox");
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
    const btn_save_config = document.getElementById("save_config");
    btn_save_config?.addEventListener("click", save_config);
    window.addEventListener('message', receive_message);
    (0, alertBox_1.showAlert)('Configuration reloaded.', 'success');
}
function save_config() {
    console.log('Save deployment config');
    let data = { 'i-releaser': {} };
    data['i-releaser']['url'] = document.getElementById('i-releaser|url').value;
    data['i-releaser']['default-workflow'] = document.getElementById('i-releaser|default-workflow').value;
    data['i-releaser']['main-branch'] = document.getElementById('i-releaser|main-branch').value;
    data['i-releaser']['auth-token'] = document.getElementById('i-releaser|auth-token').value;
    console.log('Save deployment config');
    vscode.postMessage({
        command: "save",
        data: data
    });
}
function receive_message(e) {
    switch (e.data.command) {
        case '':
            break;
    }
}
