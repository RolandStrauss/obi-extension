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
exports.AppConfig = exports.ConfigGlobal = exports.ConfigSettings = exports.ConfigCompileSettings = exports.ConfigGeneral = exports.ConfigConnection = void 0;
const vscode = __importStar(require("vscode"));
const LBTTools_1 = require("../../utilities/LBTTools");
const DirTool_1 = require("../../utilities/DirTool");
const path = __importStar(require("path"));
const Constants_1 = require("../../Constants");
const Workspace_1 = require("../../utilities/Workspace");
class ConfigConnection {
    constructor(remote_host, ssh_key, ssh_user, ssh_concurrency) {
        this['remote-host'] = remote_host;
        this['ssh-key'] = ssh_key;
        this['ssh-user'] = ssh_user;
        this['ssh-concurrency'] = ssh_concurrency;
    }
    attributes_missing() {
        const x = (!this['remote-host']);
        return (!this['remote-host']);
    }
}
exports.ConfigConnection = ConfigConnection;
class ConfigGeneral {
    constructor(local_base_dir, remote_base_dir, source_dir, local_lbt_dir, remote_lbt_dir, supported_object_types, file_system_encoding, console_output_encoding, compiled_object_list, dependency_list, deployment_object_list, build_output_dir, compile_list, compiled_object_list_md, remote_source_list, check_remote_source_on_startup, source_infos, max_threads, local_source_list, cloud_ws_ssh_remote_host) {
        this['local-base-dir'] = local_base_dir;
        this['remote-base-dir'] = remote_base_dir;
        this['local-lbt-dir'] = local_lbt_dir;
        this['remote-lbt-dir'] = remote_lbt_dir;
        this['source-dir'] = source_dir;
        this['supported-object-types'] = supported_object_types;
        this['file-system-encoding'] = file_system_encoding;
        this['console-output-encoding'] = console_output_encoding;
        this['compiled-object-list'] = compiled_object_list;
        this['remote-source-list'] = remote_source_list;
        this['source-list'] = local_source_list;
        this['source-infos'] = source_infos;
        this['dependency-list'] = dependency_list;
        this['deployment-object-list'] = deployment_object_list;
        this['build-output-dir'] = build_output_dir;
        this['compile-list'] = compile_list;
        this['compiled-object-list-md'] = compiled_object_list_md;
        this['check-remote-source-on-startup'] = check_remote_source_on_startup;
        this['max-threads'] = max_threads;
        this['cloud-ws-ssh-remote-host'] = cloud_ws_ssh_remote_host;
    }
    attributes_missing() {
        return (!this['local-base-dir'] ||
            !this['remote-base-dir'] ||
            !this['source-dir'] ||
            !this['remote-lbt-dir'] ||
            (!this['supported-object-types'] || this['supported-object-types'].length == 0) ||
            !this['file-system-encoding'] ||
            !this['console-output-encoding'] ||
            !this['compiled-object-list'] ||
            !this['source-list'] ||
            !this['remote-source-list'] ||
            !this['source-infos'] ||
            !this['dependency-list'] ||
            !this['deployment-object-list'] ||
            !this['build-output-dir'] ||
            !this['compile-list'] ||
            !this['compiled-object-list-md'] ||
            !this['max-threads']);
    }
}
exports.ConfigGeneral = ConfigGeneral;
class ConfigCompileSettings {
    constructor(settings) {
        if (settings) {
            Object.assign(this, settings);
        }
    }
    attributes_missing() {
        return (!this.TGTRLS ||
            !this.DBGVIEW ||
            !this.TGTCCSID ||
            !this.STGMDL ||
            !this.LIBL);
    }
}
exports.ConfigCompileSettings = ConfigCompileSettings;
class ConfigSettings {
    constructor(general, language) {
        if (general) {
            this.general = new ConfigCompileSettings(general);
        }
        if (language) {
            this.language = language;
        }
    }
    attributes_missing() {
        return !this.general || this.general.attributes_missing();
    }
}
exports.ConfigSettings = ConfigSettings;
class ConfigGlobal {
    constructor(settings, cmds, compile_cmds, steps) {
        if (settings?.general) {
            this.settings = new ConfigSettings(settings?.general, settings?.language);
        }
        this.cmds = cmds;
        this['compile-cmds'] = compile_cmds;
        this.steps = steps;
    }
    attributes_missing() {
        return (!this.settings || this.settings.attributes_missing() ||
            !this.cmds ||
            !this['compile-cmds'] ||
            !this.steps);
    }
}
exports.ConfigGlobal = ConfigGlobal;
class AppConfig {
    constructor(con, gen, glob, current_profile) {
        this.connection = new ConfigConnection(AppConfig.get_string(con?.['remote-host']), AppConfig.get_string(con?.['ssh-key']), AppConfig.get_string(con?.['ssh-user']), con?.['ssh-concurrency']);
        this.general = gen ?? new ConfigGeneral();
        this.global = glob ?? new ConfigGlobal();
        this.current_profile = current_profile;
    }
    static reset() {
        this._last_loading_time = 0;
        this._config = undefined;
    }
    static self_check() {
        const config = AppConfig.get_app_config();
        let error_messages = '';
        if (config.general['local-lbt-dir'] && !DirTool_1.DirTool.dir_exists(config.general['local-lbt-dir'])) {
            error_messages = `Config error: local lbt location '${config.general['local-lbt-dir']}' does not exist`;
        }
        if (config.general['local-lbt-dir'] && DirTool_1.DirTool.dir_exists(config.general['local-lbt-dir']) && !LBTTools_1.lbtTools.get_local_lbt_python_path()) {
            error_messages = `Local lbt error: Virtual environment is missing in '${config.general['local-lbt-dir']}'. Have you run the setup script?`;
        }
        if (error_messages.length > 0) {
            vscode.window.showErrorMessage(error_messages);
        }
        return error_messages;
    }
    static get_app_config(config_dict) {
        let configs = config_dict;
        let con_obj = undefined;
        let gen_obj = undefined;
        let glob_obj = undefined;
        if (!configs) {
            if (this._config && this._last_loading_time > (Date.now() - 2000)) // Reuse if only 2 seconds old
             {
                return this._config;
            }
            configs = AppConfig.load_configs();
        }
        if (configs.connection) {
            const con_dict = configs.connection;
            con_obj = new ConfigConnection(AppConfig.get_string(con_dict['remote-host']), AppConfig.get_string(con_dict['ssh-key']), AppConfig.get_string(con_dict['ssh-user']));
        }
        if (configs['general']) {
            const gen = configs.general;
            gen_obj = new ConfigGeneral(AppConfig.get_string(gen['local-base-dir']), AppConfig.get_string(gen['remote-base-dir']), AppConfig.get_string(gen['source-dir']), AppConfig.get_string(gen['local-lbt-dir']), AppConfig.get_string(gen['remote-lbt-dir']), gen['supported-object-types'], AppConfig.get_string(gen['file-system-encoding']), AppConfig.get_string(gen['console-output-encoding']), AppConfig.get_string(gen['compiled-object-list']), AppConfig.get_string(gen['dependency-list']), AppConfig.get_string(gen['deployment-object-list']), AppConfig.get_string(gen['build-output-dir']), AppConfig.get_string(gen['compile-list']), AppConfig.get_string(gen['compiled-object-list-md']), AppConfig.get_string(gen['remote-source-list']), gen['check-remote-source-on-startup'] === true, AppConfig.get_string(gen['source-infos']), gen['max-threads'], AppConfig.get_string(gen['source-list']), AppConfig.get_string(gen['cloud-ws-ssh-remote-host']));
        }
        if (configs['global']) {
            const global = configs['global'];
            glob_obj = new ConfigGlobal(global['settings'], global['cmds'], global['compile-cmds'], global['steps']);
        }
        let app_config = new AppConfig(con_obj, gen_obj, glob_obj);
        if (!config_dict) {
            this._last_loading_time = Date.now();
            this._config = app_config;
        }
        return app_config;
    }
    static get_string(value) {
        if (!value || value.length == 0) {
            return undefined;
        }
        return value.trim();
    }
    static get_profile_app_config_list() {
        let configs = [{ 'alias': 'Default User Config', 'file': Constants_1.Constants.LBT_APP_CONFIG_USER }];
        const ws = Workspace_1.Workspace.get_workspace();
        if (!ws) {
            return configs;
        }
        const files = DirTool_1.DirTool.list_dir(path.join(ws, Constants_1.Constants.LBT_APP_CONFIG_DIR));
        for (const file of files) {
            if (file.endsWith('.toml') && (file.startsWith('.user-app-config') && file != Constants_1.Constants.LBT_APP_CONFIG && file != Constants_1.Constants.LBT_APP_CONFIG_USER)) {
                configs.push({ 'alias': file.replace('.user-app-config-', '').replace('.toml', ''), 'file': file });
            }
        }
        return configs;
    }
    static change_current_profile(profile) {
        const ws_settings = Workspace_1.Workspace.get_workspace_settings();
        ws_settings.current_profile = profile;
        Workspace_1.Workspace.update_workspace_settings(ws_settings);
        AppConfig.reset();
    }
    static get_project_app_config(workspace) {
        const app_config = DirTool_1.DirTool.get_toml(path.join(workspace.fsPath, Constants_1.Constants.LBT_APP_CONFIG_FILE));
        return app_config;
    }
    static get_current_profile_app_config_name() {
        const workspace_settings = Workspace_1.Workspace.get_workspace_settings();
        let profile = '';
        if (!workspace_settings) {
            return undefined;
        }
        if (workspace_settings.current_profile) {
            return workspace_settings.current_profile;
        }
        return Constants_1.Constants.LBT_APP_CONFIG_USER;
    }
    static get_current_profile_app_config_file() {
        const profileName = AppConfig.get_current_profile_app_config_name();
        return profileName ? path.join(Constants_1.Constants.LBT_APP_CONFIG_DIR, profileName) : Constants_1.Constants.LBT_APP_CONFIG_DIR;
    }
    static get_user_app_config(workspace) {
        const user_app_config = DirTool_1.DirTool.get_toml(path.join(workspace.fsPath, AppConfig.get_current_profile_app_config_file()));
        const app_config = new AppConfig(user_app_config?.connection, user_app_config?.general, user_app_config?.global);
        return app_config;
    }
    static get_source_configs() {
        const ws = Workspace_1.Workspace.get_workspace();
        const source_config = ws ? DirTool_1.DirTool.get_toml(path.join(ws, Constants_1.Constants.LBT_SOURCE_CONFIG_FILE)) : undefined;
        return source_config;
    }
    static empty(object) {
        Object.keys(object).forEach(function (k) {
            if (object[k] && typeof object[k] === 'object' && !(object[k] instanceof Array)) {
                return AppConfig.empty(object[k]);
            }
            if (object[k] instanceof Array) {
                object[k] = [];
            }
            if (typeof object[k] === 'string') {
                object[k] = '';
            }
        });
    }
    static load_configs() {
        const ws_uri = Workspace_1.Workspace.get_workspace_uri();
        const project_app_config = AppConfig.get_project_app_config(ws_uri);
        const user_app_config = AppConfig.get_user_app_config(ws_uri);
        const config = LBTTools_1.lbtTools.override_dict(user_app_config, project_app_config);
        return config;
    }
    attributes_missing() {
        return (!this.connection || this.connection.attributes_missing() ||
            !this.general || this.general.attributes_missing() ||
            !this.global || this.global.attributes_missing());
    }
    static attributes_missing() {
        const config = AppConfig.get_app_config();
        return config.attributes_missing();
    }
}
exports.AppConfig = AppConfig;
AppConfig._config = undefined;
AppConfig._last_loading_time = 0;
