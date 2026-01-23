"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = getFiles;
exports.getChangedSources = getChangedSources;
exports.getFileHash = getFileHash;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const DirTool_1 = require("../../../utilities/DirTool");
function getFiles(dirPath, fileExtensions = [], fsEncoding = 'utf-8') {
    const src = {};
    const expandedPath = path.resolve(dirPath);
    function walk(currentPath) {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walk(filePath);
            }
            else if (fileExtensions.length === 0 || fileExtensions.some(ext => file.endsWith(ext))) {
                const relativePath = path.relative(expandedPath, filePath).replace(/\\/g, '/');
                const hash = getFileHash(filePath);
                src[relativePath] = hash;
            }
        }
    }
    walk(expandedPath);
    return src;
}
function getChangedSources(sourceDir, buildJsonPath, objectTypes, srcList) {
    if (!srcList) {
        srcList = getFiles(sourceDir, objectTypes);
    }
    const buildList = DirTool_1.DirTool.get_json(buildJsonPath) || {};
    const missingObj = [];
    const changedSrc = [];
    for (const src in srcList) {
        if (!buildList.hasOwnProperty(src) || buildList[src] === null || srcList[src] !== buildList[src]) {
            if (!buildList.hasOwnProperty(src)) {
                missingObj.push(src);
            }
            else {
                changedSrc.push(src);
            }
        }
    }
    return { 'new-objects': missingObj, 'changed-sources': changedSrc };
}
function getFileHash(filename) {
    if (fs.statSync(filename).size === 0) {
        return '';
    }
    const h = crypto.createHash('md5');
    const fileContent = fs.readFileSync(filename);
    h.update(fileContent);
    return h.digest('hex');
}
