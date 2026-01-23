"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBuildCmds = addBuildCmds;
exports.getObjectList = getObjectList;
exports.getSourceBuildCmds = getSourceBuildCmds;
exports.getCmdFromStep = getCmdFromStep;
exports.resolveCmdId = resolveCmdId;
exports.replaceCmdParameters = replaceCmdParameters;
exports.removeUnresolvedCmdParameters = removeUnresolvedCmdParameters;
exports.orderBuilds = orderBuilds;
const properties_1 = require("./properties");
const lbt_constants_1 = require("./lbt_constants");
const toml_tools_1 = require("./toml_tools");
const app_config_tools_1 = require("./app_config_tools");
const DirTool_1 = require("../../../utilities/DirTool");
const path_1 = __importDefault(require("path"));
const Workspace_1 = require("../../../utilities/Workspace");
function addBuildCmds(targetTree, appConfig, extended_sources_config) {
    let objectList = [];
    for (const targetItem of targetTree) {
        for (const sourceItem of targetItem.sources) {
            objectList.push(getObjectList(sourceItem.source, appConfig));
            sourceItem.cmds = getSourceBuildCmds(sourceItem.source, appConfig, extended_sources_config);
        }
    }
    objectList = Array.from(new Set(objectList));
    if (appConfig.general && appConfig.general['deployment-object-list']) {
        DirTool_1.DirTool.write_file(path_1.default.join(Workspace_1.Workspace.get_workspace(), appConfig.general['deployment-object-list']), objectList.join('\n'));
    }
}
function getObjectList(source, appConfig) {
    const variableDict = (0, properties_1.getSourceProperties)(appConfig, source);
    const prodLib = source.split('/')[0];
    const parts = source.split('.');
    const objType = parts[parts.length - 1];
    const objAttr = parts[parts.length - 2];
    return `prod_obj|${prodLib}|${variableDict.TARGET_LIB}|${variableDict.OBJ_NAME}|${objType}|${objAttr}|${source}`;
}
function getSourceBuildCmds(source, appConfig, extended_sources_config) {
    const sourcesConfig = DirTool_1.DirTool.get_toml(path_1.default.join(Workspace_1.Workspace.get_workspace(), lbt_constants_1.lbtConstants.get('SOURCE_CONFIG_TOML')));
    let sourceConfig = {};
    if (sourcesConfig && sourcesConfig[source]) {
        sourceConfig = sourcesConfig[source];
    }
    let steps = (0, app_config_tools_1.getSteps)(source, appConfig, extended_sources_config);
    if (sourceConfig.steps && sourceConfig.steps.length > 0) {
        steps = sourceConfig.steps;
    }
    const variableDict = (0, properties_1.getSourceProperties)(appConfig, source);
    let varDictTmp = {};
    const cmds = [];
    for (const step of steps) {
        let cmd;
        if (typeof step === 'string') {
            if (step.trim() === '')
                continue;
            cmd = getCmdFromStep(step, source, variableDict, appConfig, sourceConfig);
        }
        else if (typeof step === 'object' && step !== null) {
            varDictTmp = { ...variableDict, ...step.properties };
            cmd = step.cmd || getCmdFromStep(step.step, source, varDictTmp, appConfig, sourceConfig);
        }
        else {
            continue;
        }
        cmd = replaceCmdParameters(cmd, { ...variableDict, ...varDictTmp });
        cmds.push({ cmd: cmd, status: 'new' });
    }
    return cmds;
}
function getCmdFromStep(step, source, variableDict, appConfig, sourceConfig) {
    let cmd = resolveCmdId({ ...appConfig, ...sourceConfig }, step);
    const percentWords = cmd.match(/%[\w\.]+%/g) || [];
    for (const word of percentWords) {
        const key = word.replace(/%/g, '');
        const subcmd = resolveCmdId({ ...appConfig, ...sourceConfig }, key);
        cmd = cmd.replace(word, subcmd);
    }
    variableDict['SET_LIBL'] = (0, properties_1.getSetLiblCmd)(appConfig, variableDict.LIBL || [], variableDict.TARGET_LIB);
    if (!cmd) {
        throw new Error(`Step '${step}' not found in '${lbt_constants_1.lbtConstants.get('CONFIG_TOML')}' or '${lbt_constants_1.lbtConstants.get('CONFIG_USER_TOML')}'`);
    }
    const dspjoblogCmd = appConfig.global?.cmds?.dspjoblog;
    if (dspjoblogCmd) {
        const joblogSep = appConfig.global?.cmds?.['joblog-separator'] || '';
        cmd += dspjoblogCmd.replace('$(joblog-separator)', joblogSep);
    }
    return cmd;
}
function resolveCmdId(config, cmdid) {
    const cmdidList = cmdid.match(/"[^"]*"|[^.]+/g).map(s => s.replace(/"/g, ""));
    const cmd = (0, toml_tools_1.getTableElement)(config, cmdidList);
    if (!cmd) {
        throw new Error(`CmdID '${cmdid}' not found in config`);
    }
    return cmd;
}
function replaceCmdParameters(cmd, variableDict) {
    for (const k in variableDict) {
        const v = variableDict[k];
        if (typeof v !== 'string' && typeof v !== 'number') {
            continue;
        }
        cmd = cmd.replace(new RegExp(`\\$\\(${k}\\)`, 'g'), String(v));
    }
    return removeUnresolvedCmdParameters(cmd);
}
function removeUnresolvedCmdParameters(cmd) {
    cmd = cmd.replace(/ACTGRP\(\$\(ACTGRP\)\)/g, '');
    cmd = cmd.replace(/ACTGRP\(\)/g, '');
    cmd = cmd.replace(/BNDDIR\(\$\(INCLUDE_BNDDIR\)\)/g, '');
    cmd = cmd.replace(/BNDDIR\(\)/g, '');
    cmd = cmd.replace(/TGTRLS\(\$\(TGTRLS\)\)/g, '');
    cmd = cmd.replace(/TGTRLS\(\)/g, '');
    cmd = cmd.replace(/STGMDL\(\$\(STGMDL\)\)/g, '');
    cmd = cmd.replace(/STGMDL\(\)/g, '');
    cmd = cmd.replace(/TGTCCSID\(\$\(TGTCCSID\)\)/g, '');
    cmd = cmd.replace(/TGTCCSID\(\)/g, '');
    cmd = cmd.replace(/DBGVIEW\(\$\(DBGVIEW\)\)/g, '');
    cmd = cmd.replace(/DBGVIEW\(\)/g, '');
    cmd = cmd.replace(/INCDIR\(\$\(INCDIR_SQLRPGLE\)\)/g, '');
    cmd = cmd.replace(/INCDIR\(\)/g, '');
    cmd = cmd.replace(/INCDIR\(\$\(INCDIR_RPGLE\)\)/g, '');
    cmd = cmd.replace(/INCDIR\(\)/g, '');
    return cmd;
}
function orderBuilds(targetTree) {
    const orderedTargetTree = { timestamp: targetTree.timestamp, compiles: [] };
    for (const compiles of targetTree.compiles) {
        const levelList = { level: compiles.level, sources: [] };
        for (const sourceEntry of compiles.sources) {
            if (sourceEntry.source.split('.').pop() === 'file') {
                levelList.sources.unshift(sourceEntry);
                continue;
            }
            levelList.sources.push(sourceEntry);
        }
        orderedTargetTree.compiles.push(levelList);
    }
    return orderedTargetTree;
}
