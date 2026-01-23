"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceProperties = getSourceProperties;
exports.getSetLiblCmd = getSetLiblCmd;
exports.getTargetLib = getTargetLib;
const lbt_constants_1 = require("./lbt_constants");
const toml_tools_1 = require("./toml_tools");
const DirTool_1 = require("../../../utilities/DirTool");
const path_1 = __importDefault(require("path"));
const Workspace_1 = require("../../../utilities/Workspace");
function getSourceProperties(config, source) {
    const sourceConfig = DirTool_1.DirTool.get_toml(path_1.default.join(Workspace_1.Workspace.get_workspace(), lbt_constants_1.lbtConstants.get('SOURCE_CONFIG_TOML')));
    const srcSuffixes = source.split('.').slice(1).join('.');
    //const fileExtensions = srcSuffixes.split('.').slice(-2).join('');
    const fileExtensions = source.split('.').slice(-2).join('.');
    let globalSettings = (0, toml_tools_1.getTableElement)(config, ['global', 'settings', 'general']);
    const typeSettings = (0, toml_tools_1.getTableElement)(config, ['global', 'settings', 'language'])?.[fileExtensions] || {};
    if (sourceConfig && source in sourceConfig && 'settings' in sourceConfig[source]) {
        globalSettings = { ...globalSettings, ...sourceConfig[source]['settings'] };
    }
    globalSettings = { ...globalSettings, ...typeSettings };
    globalSettings['SOURCE_FILE_NAME'] = path_1.default.join(config['general']['source-dir'], source).replace(/\\/g, '/');
    globalSettings['SOURCE_BASE_FILE_NAME'] = path_1.default.basename(globalSettings['SOURCE_FILE_NAME']);
    globalSettings['TARGET_LIB'] = getTargetLib(source, globalSettings.TARGET_LIB, globalSettings.TARGET_LIB_MAPPING);
    globalSettings['OBJ_NAME'] = path_1.default.basename(source).split('.')[0];
    globalSettings['SET_LIBL'] = getSetLiblCmd(config, globalSettings.LIBL || [], globalSettings.TARGET_LIB);
    return globalSettings;
}
function getSetLiblCmd(config, libl, targetLib) {
    let setLibl = '';
    for (const lib of libl) {
        const resolvedLib = lib.replace('$(TARGET_LIB)', targetLib);
        if (setLibl.length > 0) {
            setLibl += '; ';
        }
        setLibl += config['global']['cmds']['add-lible'].replace('$(LIB)', resolvedLib);
    }
    return setLibl;
}
function getTargetLib(source, targetLib, libMapping) {
    const sourceLib = source.split('/')[0].toLowerCase();
    if (targetLib && targetLib.toLowerCase() === '*source') {
        return sourceLib;
    }
    if (targetLib) {
        return targetLib.toLowerCase();
    }
    if (libMapping) {
        for (const k in libMapping) {
            if (k.toLowerCase() === sourceLib) {
                return libMapping[k].toLowerCase();
            }
        }
    }
    return sourceLib;
}
