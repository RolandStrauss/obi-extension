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
    let button = document.getElementById("add_dependency_1");
    button?.addEventListener("click", add_dependency_1);
    button = document.getElementById("add_dependency_2");
    button?.addEventListener("click", add_dependency_2);
    let delete_buttons = document.getElementsByClassName(`delete_dependency_1`);
    for (let i = 0; i < delete_buttons.length; i++) {
        const e = delete_buttons[i];
        e.addEventListener('click', () => {
            delete_dependency(1, e.id);
        });
    }
    delete_buttons = document.getElementsByClassName(`delete_dependency_2`);
    for (let i = 0; i < delete_buttons.length; i++) {
        const e = delete_buttons[i];
        e.addEventListener('click', () => {
            delete_dependency(2, e.id);
        });
    }
    window.addEventListener('message', receive_message);
    (0, alertBox_1.showAlert)('Configuration reloaded.', 'success');
}
function delete_dependency(type, id) {
    const button = document.getElementById(id);
    let source = button?.getAttribute('source');
    console.log(`Delete dependency ${type} ${source}`);
    vscode.postMessage({
        command: `delete_dependency_${type}`,
        source: source
    });
    reload();
}
function add_dependency_1() {
    const new_source = document.getElementById("source_list_1").value;
    add_dependency(1, new_source);
}
function add_dependency_2() {
    const new_source = document.getElementById("source_list_2").value;
    add_dependency(2, new_source);
}
function add_dependency(type, source) {
    console.log(`Add dependency ${source}, type: ${type}`);
    if (source.trim() == "") {
        (0, alertBox_1.showAlert)("Please choose a source.", "info");
        return;
    }
    vscode.postMessage({
        command: "add_dependency_" + type,
        source: source.trim()
    });
    reload();
}
function reload() {
    vscode.postMessage({
        command: "reload"
    });
}
function receive_message(e) {
    switch (e.data.command) {
        case 'run_finished':
            break;
    }
}
