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
exports.createBuildList = createBuildList;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const files_1 = require("./modules/files");
const dependency_1 = require("./modules/dependency");
const build_cmds_1 = require("./modules/build_cmds");
const lbt_constants_1 = require("./modules/lbt_constants");
const DirTool_1 = require("../../utilities/DirTool");
const AppConfig_1 = require("../../webview/controller/AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const LBTTools_1 = require("../../utilities/LBTTools");
function createBuildList(source) {
    console.log('Create build list');
    const ws = Workspace_1.Workspace.get_workspace();
    const appConfig = AppConfig_1.AppConfig.get_app_config();
    const generalConfig = appConfig.general;
    const sourceDir = path.join(ws, generalConfig['local-base-dir'], generalConfig['source-dir']);
    const buildListPath = path.join(ws, generalConfig['compiled-object-list']);
    const objectTypes = generalConfig['supported-object-types'];
    const dependencyList = LBTTools_1.lbtTools.get_dependency_list();
    const buildOutputDir = path.join(ws, generalConfig['build-output-dir'] || '.lbt/build-output');
    if (fs.existsSync(buildOutputDir)) {
        fs.rmSync(buildOutputDir, { recursive: true, force: true });
    }
    let changedSourcesList;
    if (source) {
        changedSourcesList = (0, files_1.getChangedSources)(sourceDir, buildListPath, objectTypes, { [source]: '' });
    }
    else {
        const sourceList = (0, files_1.getFiles)(sourceDir, objectTypes);
        changedSourcesList = (0, files_1.getChangedSources)(sourceDir, buildListPath, objectTypes, sourceList);
    }
    DirTool_1.DirTool.write_json(path.join(ws, lbt_constants_1.lbtConstants.get('CHANGED_OBJECT_LIST')), changedSourcesList);
    let buildTargets = (0, dependency_1.getBuildOrder)(dependencyList, [
        ...changedSourcesList['new-objects'],
        ...changedSourcesList['changed-sources'],
    ]);
    buildTargets = (0, build_cmds_1.orderBuilds)(buildTargets);
    DirTool_1.DirTool.write_json(path.join(ws, generalConfig['compile-list']), buildTargets);
}
