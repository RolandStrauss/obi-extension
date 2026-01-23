"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAlert = showAlert;
const webview_ui_toolkit_1 = require("@vscode/webview-ui-toolkit");
// In order to use all the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
(0, webview_ui_toolkit_1.provideVSCodeDesignSystem)().register(webview_ui_toolkit_1.allComponents);
function showAlert(text, type = 'info') {
    const box = document.getElementById('alertBox');
    box.textContent = text;
    box.className = `alert ${type}`;
    box.style.display = 'block';
    console.log(`Show alert: ${type} - ${box.className}`);
    setTimeout(() => box.style.display = 'none', 2000);
}
