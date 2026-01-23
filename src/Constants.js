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
exports.Constants = void 0;
const path = __importStar(require("path"));
class Constants {
}
exports.Constants = Constants;
Constants.HTML_TEMPLATE_DIR = path.join(__dirname, '..', 'asserts', 'templates');
Constants.LBT_DIR = ".lbt";
Constants.LBT_CONFIGS_DIR = ".lbt/etc";
Constants.LBT_APP_CONFIG_DIR = `${Constants.LBT_CONFIGS_DIR}`;
Constants.SOURCE_FILTER_FOLDER_NAME = '.lbt/source-list';
Constants.BUILD_OUTPUT_DIR = ".lbt/build-output";
Constants.BUILD_HISTORY_DIR = ".lbt/build-history";
Constants.LBT_STATUS_FILE = `${Constants.BUILD_OUTPUT_DIR}/status.json`;
Constants.LBT_WORKSPACE_SETTINGS_FILE = `${Constants.LBT_CONFIGS_DIR}/workspace-settings.json`;
Constants.LBT_BACKEND_VERSION = 3;
Constants.LBT_APP_CONFIG = 'app-config.toml';
Constants.LBT_APP_CONFIG_FILE = `${Constants.LBT_APP_CONFIG_DIR}/${Constants.LBT_APP_CONFIG}`;
Constants.LBT_APP_CONFIG_USER = '.user-app-config.toml';
Constants.LBT_APP_CONFIG_USER_FILE = `${Constants.LBT_APP_CONFIG_DIR}/${Constants.LBT_APP_CONFIG_USER}`;
Constants.LBT_SOURCE_CONFIG_FILE = ".lbt/etc/source-config.toml";
Constants.LBT_TMP_DIR = ".lbt/tmp";
Constants.LBT_LOG_FILE = ".lbt/log/main.log";
Constants.DEPENDEND_OBJECT_LIST = ".lbt/tmp/dependend-object-list.json";
Constants.CHANGED_OBJECT_LIST = ".lbt/tmp/changed-object-list.json";
Constants.REMOTE_LBT_PYTHON_PATH = "venv/bin/python";
Constants.DEPLOYMENT_CONFIG_FILE = ".lbt/etc/deployment.toml";
Constants.DEPENDENCY_LIST = ".lbt/etc/dependency.json";
Constants.SOURCE_LIST = ".lbt/etc/source-list.json";
Constants.REMOTE_SOURCE_LIST = '.lbt/etc/source-list-remote.json';
Constants.COMPILED_OBJECT_LIST = '.lbt/etc/object-builds.json';
