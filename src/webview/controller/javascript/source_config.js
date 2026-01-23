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
    let button = document.getElementById("save_config");
    button?.addEventListener("click", save_config);
    button = document.getElementById("add_source_setting");
    button?.addEventListener("click", add_source_setting);
    let app_elements = document.getElementsByClassName(`delete_source_setting`);
    for (let i = 0; i < app_elements.length; i++) {
        const key = app_elements[i].getAttribute('key') || '';
        app_elements[i].addEventListener('click', () => { delete_source_setting(key); });
    }
    button = document.getElementById("add_source_cmd");
    button?.addEventListener("click", add_source_cmd);
    app_elements = document.getElementsByClassName(`delete_source_cmd`);
    for (let i = 0; i < app_elements.length; i++) {
        const key = app_elements[i].getAttribute('key') || '';
        app_elements[i].addEventListener('click', () => { delete_source_cmd(key); });
    }
    window.addEventListener('message', receive_message);
    (0, alertBox_1.showAlert)('Configuration reloaded.', 'success');
}
function add_source_setting() {
    save_config();
    const key = document.getElementById("new_source_setting_key").value;
    const value = document.getElementById("new_source_setting_value").value;
    const type = document.getElementById("new_source_setting_type").value;
    console.log(`add_source_setting: ${key} : ${value} : ${type}`);
    vscode.postMessage({
        command: "add_source_setting",
        key: key,
        value: value,
        type: type
    });
    reload();
}
function delete_source_setting(key) {
    save_config();
    console.log(`delete_source_setting: ${key}`);
    vscode.postMessage({
        command: "delete_source_setting",
        key: key
    });
    reload();
}
function add_source_cmd() {
    save_config();
    const key = document.getElementById("new_source_cmd_key").value;
    const value = document.getElementById("new_source_cmd_value").value;
    console.log(`New command ${key}: ${value}`);
    vscode.postMessage({
        command: "add_source_cmd",
        key: key,
        value: value
    });
    reload();
}
function delete_source_cmd(key) {
    save_config();
    console.log(`delete_source_cmd: ${key}`);
    vscode.postMessage({
        command: "delete_source_cmd",
        key: key
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
function save_config() {
    let app_elements = document.getElementsByClassName(`save_source_setting`);
    let source_settings = {};
    console.log(`save_source_setting: ${app_elements.length}`);
    let key = '';
    let value = '';
    for (let i = 0; i < app_elements.length; i++) {
        key = app_elements[i].getAttribute('key') || 'undefined';
        switch (app_elements[i].constructor.name) {
            case 'TextArea2':
                value = Array.from(app_elements[i].value.split('\n'));
                break;
            default:
                value = app_elements[i].value;
                break;
        }
        source_settings[key] = value;
    }
    app_elements = document.getElementsByClassName(`save_source_cmd`);
    let source_cmds = {};
    console.log(`save_source_cmd: ${app_elements.length}`);
    for (let i = 0; i < app_elements.length; i++) {
        const key = app_elements[i].getAttribute('key') || 'undefined';
        const value = app_elements[i].value;
        source_cmds[key] = value;
    }
    console.log(`steps: ${document.getElementById("steps")}`);
    const steps_value = document.getElementById("steps").value;
    let steps = [];
    if (steps_value.length > 0) {
        steps = steps_value.split('\n');
    }
    vscode.postMessage({
        command: "save_config",
        settings: source_settings,
        source_cmds: source_cmds,
        steps: steps
    });
}
