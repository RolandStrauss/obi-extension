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
exports.getBuildOrder = getBuildOrder;
exports.getTargetsDependedObjects = getTargetsDependedObjects;
exports.getTargetDependedObjects = getTargetDependedObjects;
exports.getTargetsOnlyDependedObjects = getTargetsOnlyDependedObjects;
exports.getTargetOnlyDependedObjects = getTargetOnlyDependedObjects;
exports.removeDuplicities = removeDuplicities;
exports.getTargetsByLevel = getTargetsByLevel;
exports.getCopySources = getCopySources;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lbt_constants_1 = require("./lbt_constants");
const dict_tools_1 = require("./dict_tools");
const build_cmds_1 = require("./build_cmds");
const AppConfig_1 = require("../../../webview/controller/AppConfig");
const Workspace_1 = require("../../../utilities/Workspace");
const DirTool_1 = require("../../../utilities/DirTool");
const Logger_1 = require("../../../utilities/Logger");
function getBuildOrder(dependencyDict, targetList = [], appConfig) {
    if (!appConfig) {
        appConfig = AppConfig_1.AppConfig.get_app_config();
    }
    const objectsTree = getTargetsDependedObjects(dependencyDict, targetList);
    const ws = Workspace_1.Workspace.get_workspace();
    DirTool_1.DirTool.write_json(path.join(ws, '.lbt/tmp/objects_tree.json'), objectsTree);
    const dependendObjects = getTargetsOnlyDependedObjects(dependencyDict, targetList);
    DirTool_1.DirTool.write_json(path.join(ws, lbt_constants_1.lbtConstants.get('DEPENDEND_OBJECT_LIST')), dependendObjects);
    const allObjectsToBuild = Array.from(new Set([...targetList, ...dependendObjects]));
    let orderedTargetTree = getTargetsByLevel(objectsTree);
    if (appConfig.general?.ALWAYS_TRANSFER_RELATED_COPYBOOKS) {
        const copySources = getCopySources(dependencyDict, allObjectsToBuild);
        Logger_1.logger.info(`Found copy sources: ${copySources.join(', ')}`);
        if (copySources.length > 0) {
            orderedTargetTree.unshift({
                level: 0,
                sources: copySources.map(src => ({ source: src, cmds: [] }))
            });
        }
    }
    DirTool_1.DirTool.write_json(path.join(ws, '.lbt/tmp/ordered_target_tree.json'), orderedTargetTree);
    let newTargetTree = removeDuplicities(orderedTargetTree);
    DirTool_1.DirTool.write_json(path.join(ws, '.lbt/tmp/new_target_tree.json'), newTargetTree);
    if (!appConfig) {
        appConfig = AppConfig_1.AppConfig.get_app_config();
    }
    const extended_sources_config = DirTool_1.DirTool.get_toml(lbt_constants_1.lbtConstants.get('EXTENDED_SOURCE_PROCESS_CONFIG_TOML'));
    (0, build_cmds_1.addBuildCmds)(newTargetTree, appConfig, extended_sources_config);
    const result = { timestamp: new Date().toISOString(), compiles: newTargetTree };
    return result;
}
function getTargetsDependedObjects(dependencyDict, targets = [], result = {}) {
    const targetsObjects = {};
    for (const target of targets) {
        targetsObjects[target] = getTargetDependedObjects(dependencyDict, target);
    }
    return targetsObjects;
}
function getTargetDependedObjects(dependencyDict, target, result = {}) {
    const dependendObjects = {};
    const srcBasePath = AppConfig_1.AppConfig.get_app_config()?.['general']?.['source-dir'] || 'src';
    const ws = Workspace_1.Workspace.get_workspace();
    for (const obj in dependencyDict) {
        if (dependendObjects.hasOwnProperty(obj)) {
            continue;
        }
        if (dependencyDict[obj].includes(target)) {
            if (!fs.existsSync(path.join(ws, srcBasePath, obj))) {
                continue;
            }
            dependendObjects[obj] = getTargetDependedObjects(dependencyDict, obj, result);
        }
    }
    return dependendObjects;
}
function getTargetsOnlyDependedObjects(dependencyDict, targets = []) {
    let targetsObjects = [];
    for (const target of targets) {
        targetsObjects = targetsObjects.concat(getTargetOnlyDependedObjects(dependencyDict, target, targets));
    }
    return Array.from(new Set(targetsObjects));
}
function getTargetOnlyDependedObjects(dependencyDict, target, origTargets) {
    let dependendObjects = [];
    const srcBasePath = AppConfig_1.AppConfig.get_app_config()['general']?.['source-dir'] || 'src';
    const ws = Workspace_1.Workspace.get_workspace();
    for (const obj in dependencyDict) {
        if (dependencyDict[obj].includes(target)) {
            if (!fs.existsSync(path.join(ws, srcBasePath, obj))) {
                continue;
            }
            if (origTargets.includes(obj)) {
                continue;
            }
            dependendObjects = dependendObjects.concat([obj], getTargetOnlyDependedObjects(dependencyDict, obj, origTargets));
        }
    }
    return dependendObjects;
}
function removeDuplicities(targetTree = []) {
    Logger_1.logger.debug('Sort target tree by level');
    const sortedTree = [...targetTree].sort((a, b) => a.level - b.level);
    Logger_1.logger.info('Remove duplicities from build order');
    //for (const levelItem of sortedTree) {
    //  for (const obj of levelItem.sources) {
    //    for (const revLevelItem of [...sortedTree].reverse()) {
    //      const revLevelSources = revLevelItem.sources.map((item: any) => item.source);
    //      for (let i = 0; i < sortedTree.length; i++) {
    //        const sources = sortedTree[i].sources.map((item: any) => item.source);
    //        if (
    //          sortedTree[i].level < revLevelItem.level &&
    //          revLevelSources.includes(obj.source) &&
    //          sources.includes(obj.source)
    //        ) {
    //          sortedTree[i].sources = sortedTree[i].sources.filter((item: any) => item.source !== obj.source);
    //        }
    //      }
    //    }
    //  }
    //}
    const optimizeTree = (sortedTree) => {
        const seenSources = new Set();
        // 1. Reverse the tree to start from the highest level (Level 5 -> Level 1)
        // We use slice() to avoid mutating the original array order during iteration
        const reversedTree = [...sortedTree].reverse();
        for (const levelItem of reversedTree) {
            // 2. Filter sources: keep only those NOT seen in a higher level
            levelItem.sources = levelItem.sources.filter(obj => {
                if (seenSources.has(obj.source)) {
                    return false; // Duplicate found at a higher level, remove from this lower level
                }
                else {
                    seenSources.add(obj.source); // Mark as seen
                    return true;
                }
            });
        }
        return sortedTree;
    };
    const result = optimizeTree(sortedTree);
    return result;
    //return sortedTree;
}
function getTargetsByLevel(targetTree = {}, level = 1) {
    let newTargetTree = [];
    for (const obj in targetTree) {
        let loopLevelObj = newTargetTree.find(item => item.level === level);
        if (!loopLevelObj) {
            loopLevelObj = { level: level, sources: [] };
            newTargetTree.push(loopLevelObj);
        }
        if (loopLevelObj.sources.some((item) => item.source === obj)) {
            continue;
        }
        loopLevelObj.sources.push({ source: obj, cmds: [] });
        const nextObjs = targetTree[obj];
        for (const nextObj in nextObjs) {
            let loopNextLevelObj = newTargetTree.find(item => item.level === level + 1);
            if (!loopNextLevelObj) {
                loopNextLevelObj = { level: level + 1, sources: [] };
                newTargetTree.push(loopNextLevelObj);
            }
            if (loopNextLevelObj.sources.some((item) => item.source === nextObj)) {
                continue;
            }
            loopNextLevelObj.sources.push({ source: nextObj, cmds: [] });
            const extendedTree = getTargetsByLevel(nextObjs[nextObj], level + 2);
            newTargetTree = (0, dict_tools_1.deepListMerge)(extendedTree, newTargetTree);
        }
    }
    return newTargetTree.sort((a, b) => a.level - b.level);
}
function getCopySources(dependencyDict, targets, allDependencies = new Set()) {
    for (const target of targets) {
        const directDependencies = dependencyDict[target] || [];
        for (const dep of directDependencies) {
            if (!allDependencies.has(dep)) {
                allDependencies.add(dep);
                getCopySources(dependencyDict, [dep], allDependencies);
            }
        }
    }
    return Array.from(allDependencies).filter(dep => dep.toLowerCase().endsWith('.cpy'));
}
