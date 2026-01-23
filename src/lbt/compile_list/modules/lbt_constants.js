"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lbtConstants = void 0;
class lbtConstants {
    static get(key, defaultValue = null) {
        // In a real scenario, you might fetch this from a config file or environment variables
        if (key in lbtConstants) {
            return lbtConstants[key];
        }
        return defaultValue;
    }
}
exports.lbtConstants = lbtConstants;
lbtConstants.CONFIG_TOML = '.lbt/etc/app-config.toml';
lbtConstants.CONFIG_USER_TOML = '.lbt/etc/.user-app-config.toml';
lbtConstants.SOURCE_CONFIG_TOML = '.lbt/etc/source-config.toml';
lbtConstants.DEPENDEND_OBJECT_LIST = '.lbt/tmp/dependend-object-list.json';
lbtConstants.CHANGED_OBJECT_LIST = '.lbt/tmp/changed-object-list.json';
lbtConstants.EXTENDED_SOURCE_PROCESS_CONFIG_TOML = '.lbt/etc/extended-source-processing-config.toml';
lbtConstants.ESP_SCRIPT_FOLDER = '.lbt/etc/scripts';
lbtConstants.UPDATE_OBJECT_LIST = false;
lbtConstants.JOB_LOG = '.lbt/log/joblog.txt';
lbtConstants.constants = {};
