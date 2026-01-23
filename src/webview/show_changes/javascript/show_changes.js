"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webview_ui_toolkit_1 = require("@vscode/webview-ui-toolkit");
// In order to use all the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
(0, webview_ui_toolkit_1.provideVSCodeDesignSystem)().register(webview_ui_toolkit_1.allComponents);
const vscode = acquireVsCodeApi();
let loaded = false;
window.addEventListener("load", main);
function main() {
    // To get improved type annotations/IntelliSense the associated class for
    // a given toolkit component can be imported and used to type cast a reference
    // to the element (i.e. the `as Button` syntax)
    console.log(`Load main ${loaded}`);
    if (loaded) {
        return;
    }
    loaded = true;
    const run_button = document.getElementById('run_build');
    console.log(`run_button.addEventListener ${run_button}`);
    if (run_button) {
        run_button.addEventListener('click', run_build);
    }
    const joblogButton = document.getElementsByClassName("joblog");
    console.log(`joblog.addEventListener ${joblogButton.length}`);
    for (let i = 0; i < joblogButton.length; i++) {
        joblogButton[i].addEventListener("click", function (e) { show_log('joblog', joblogButton[i]); });
    }
    const splfButton = document.getElementsByClassName("stdout");
    for (let i = 0; i < splfButton.length; i++) {
        splfButton[i].addEventListener("click", function (e) { show_log('stdout', splfButton[i]); });
    }
    const errorButton = document.getElementsByClassName("stderr");
    for (let i = 0; i < errorButton.length; i++) {
        errorButton[i].addEventListener("click", function (e) { show_log('stderr', errorButton[i]); });
    }
}
function run_build() {
    const build_source = document.getElementsByClassName("build_source");
    const build_source_cmd = document.getElementsByClassName("build_source_cmd");
    let ignore_sources = [];
    let ignore_sources_cmd = {};
    for (let i = 0; i < build_source.length; i++) {
        const checkbox = build_source[i];
        if (!checkbox.checked) {
            ignore_sources.push(checkbox.getAttribute('source') || '');
        }
    }
    for (let i = 0; i < build_source_cmd.length; i++) {
        const checkbox = build_source_cmd[i];
        if (!checkbox.checked) {
            const source = checkbox.getAttribute('source');
            if (source !== null) {
                if (!ignore_sources_cmd[source]) {
                    ignore_sources_cmd[source] = [];
                }
                ignore_sources_cmd[source].push(checkbox.getAttribute('cmd') || '');
            }
        }
    }
    vscode.postMessage({
        command: "run_build",
        ignore_sources: ignore_sources,
        ignore_sources_cmd: ignore_sources_cmd
    });
}
//--function handleHowdyClick() {
function show_log(log_type, e) {
    const level = e.getAttribute('level') || '';
    const source = e.getAttribute('source') || '';
    const cmd_index = Number(e.getAttribute('cmd_index'));
    vscode.postMessage({
        command: "show_log",
        type: log_type,
        level: level,
        cmd_index: cmd_index,
        source: source
    });
}
