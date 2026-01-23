"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableElement = getTableElement;
function getTableElement(toml, treeList) {
    let tomlCopy = structuredClone(toml);
    for (const entry of treeList) {
        if (!(entry in tomlCopy)) {
            return null;
        }
        tomlCopy = tomlCopy[entry];
    }
    return tomlCopy;
}
