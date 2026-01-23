"use strict";
// file: src/utilities/getUri.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUri = getUri;
const vscode_1 = require("vscode");
function getUri(webview, extensionUri, pathList) {
    return webview.asWebviewUri(vscode_1.Uri.joinPath(extensionUri, ...pathList));
}
