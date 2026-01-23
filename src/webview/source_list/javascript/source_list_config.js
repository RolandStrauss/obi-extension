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
    const add_filter_button = document.getElementById("add_filter");
    add_filter_button?.addEventListener("click", add_filter);
    const delete_buttons = document.getElementsByClassName('delete_filter');
    for (let i = 0; i < delete_buttons.length; i++) {
        const e = delete_buttons[i];
        e.addEventListener('click', () => {
            delete_filter(e.id);
        });
    }
    (0, alertBox_1.showAlert)('Configuration reloaded.', 'success');
}
function delete_filter(id) {
    const button = document.getElementById(id);
    let lib = button?.getAttribute('lib');
    let file = button?.getAttribute('file');
    let member = button?.getAttribute('member');
    console.log(`Delete ${lib}, ${file}, ${member}`);
    vscode.postMessage({
        command: "delete_filter",
        lib: lib,
        file: file,
        member: member
    });
}
function add_filter() {
    const new_libs = document.getElementById("new_lib").value.split(',');
    const new_files = document.getElementById("new_file").value.split(',');
    const new_members = document.getElementById("new_member").value.split(',');
    const regex = document.getElementById("new_regex").checked;
    console.log(`Add filter ${new_libs}, ${new_files}, ${new_members}, regex: ${regex}`);
    for (let new_lib of new_libs) {
        for (let new_file of new_files) {
            for (let new_member of new_members) {
                if (new_lib == '') {
                    new_lib = regex ? '.*' : '*';
                }
                if (new_file == '') {
                    new_file = regex ? '.*' : '*';
                }
                if (new_member == '') {
                    new_member = regex ? '.*' : '*';
                }
                vscode.postMessage({
                    command: "add_filter",
                    lib: new_lib.trim(),
                    file: new_file.trim(),
                    member: new_member.trim(),
                    regex: regex
                });
            }
        }
    }
}
function save_config() {
    let filter = [];
    let counter = 0;
    let els = document.getElementsByClassName(`source_filter_${counter}`);
    let [lib, file, member] = '';
    while (els.length > 0) {
        const libs = document.getElementById(`lib_${counter}`).value.split(',');
        const files = document.getElementById(`file_${counter}`).value.split(',');
        const members = document.getElementById(`member_${counter}`).value.split(',');
        const regex = document.getElementById(`regex_${counter}`).checked;
        const show_empty_folders = document.getElementById(`show_empty_folders_${counter}`).checked;
        for (let lib of libs) {
            for (let file of files) {
                for (let member of members) {
                    if (lib == '') {
                        lib = regex ? '.*' : '*';
                    }
                    if (file == '') {
                        file = regex ? '.*' : '*';
                    }
                    if (member == '') {
                        member = regex ? '.*' : '*';
                    }
                    filter.push({
                        "source-file": file.trim(),
                        "source-lib": lib.trim(),
                        "source-member": member.trim(),
                        "use-regex": regex,
                        "show-empty-folders": show_empty_folders,
                    });
                }
            }
        }
        counter++;
        els = document.getElementsByClassName(`source_filter_${counter}`);
    }
    vscode.postMessage({
        command: 'save_config',
        data: filter
    });
}
