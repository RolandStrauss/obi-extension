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
    console.log('Main ...');
    const save_button = document.getElementById("save_config");
    save_button?.addEventListener("click", save_config);
    (0, alertBox_1.showAlert)('Configuration reloaded.', 'success');
}
function save_config() {
    let sources = {};
    let els = document.getElementsByClassName('source_description');
    let lib = '';
    let file = '';
    let member = '';
    for (let i = 0; i < els.length; i++) {
        const el = els[i];
        lib = el.getAttribute('lib');
        file = el.getAttribute('file');
        member = el.getAttribute('member');
        console.log(`${lib} - ${file} - ${member}: ${el.value}`);
        const full_name = `${lib || 'UNKNOWN'}/${file || 'UNKNOWN'}/${member || 'UNKNOWN'}`;
        sources[full_name] = { description: el.value };
    }
    vscode.postMessage({
        command: 'save_config',
        data: sources
    });
}
