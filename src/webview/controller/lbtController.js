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
exports.lbtController = void 0;
const vscode = __importStar(require("vscode"));
const getUri_1 = require("../../utilities/getUri");
const DirTool_1 = require("../../utilities/DirTool");
const LBTTools_1 = require("../../utilities/LBTTools");
const Constants_1 = require("../../Constants");
const path = __importStar(require("path"));
const BuildSummary_1 = require("../show_changes/BuildSummary");
const fs = __importStar(require("fs"));
const AppConfig_1 = require("./AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const SystemCmdExecution_1 = require("../../utilities/SystemCmdExecution");
const Logger_1 = require("../../utilities/Logger");
const LBTConfiguration_1 = require("./LBTConfiguration");
/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
class lbtController {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        lbtController.view_object = this;
        lbtController.set_build_watcher();
    }
    static set_build_watcher() {
        if (lbtController.is_config_watcher_set || !LBTTools_1.lbtTools.contains_lbt_project())
            return;
        const config = AppConfig_1.AppConfig.get_app_config();
        if (AppConfig_1.AppConfig.attributes_missing())
            return;
        const ws = Workspace_1.Workspace.get_workspace();
        if (!ws)
            return;
        const compile_list_file_path = path.join(ws, config.general['compile-list']);
        // if compile-script changed, refresh the view
        fs.watchFile(compile_list_file_path, { interval: 1000 }, function (event, filename) {
            lbtController.update_build_summary_timestamp();
        });
    }
    static async update() {
        if (lbtController.view_object && lbtController.view_object._view) {
            lbtController.view_object.resolveWebviewView(lbtController.view_object._view, lbtController.view_object._context, lbtController.view_object._token);
        }
    }
    static check_lbt_response() {
        const ws = Workspace_1.Workspace.get_workspace();
        const lbt_status_file = ws ? path.join(ws, Constants_1.Constants.LBT_STATUS_FILE) : '';
        if (DirTool_1.DirTool.file_exists(lbt_status_file)) {
            const status = DirTool_1.DirTool.get_json(lbt_status_file);
            if (status) {
                Logger_1.logger.info(`Status: ${JSON.stringify(status)}`);
                if (!status['version'] || status['version'] < Constants_1.Constants.LBT_BACKEND_VERSION) {
                    vscode.window.showWarningMessage('An update for lbt backend is available.', 'Update').then(async (selection) => {
                        if (selection === 'Update') {
                            const config = AppConfig_1.AppConfig.get_app_config();
                            const cmd = 'git pull';
                            try {
                                const localLbtDir = config.general['local-lbt-dir'];
                                if (localLbtDir) {
                                    await SystemCmdExecution_1.SystemCmdExecution.run_system_cmd(localLbtDir, cmd, 'update_lbt');
                                }
                                vscode.window.showInformationMessage('lbt backend updated successfully.');
                            }
                            catch (error) {
                                if (error.signal === 'SIGTERM') {
                                    vscode.window.showErrorMessage('Git pull command was aborted.');
                                }
                                throw error;
                            }
                        }
                    });
                }
                if (status['message']) {
                    vscode.window.showErrorMessage(status['message'], 'Open Details').then(selection => {
                        if (selection === 'Open Details') {
                            vscode.window.showInformationMessage(status['details'], { modal: true });
                        }
                    });
                }
            }
        }
    }
    static run_finished() {
        lbtController.view_object._view?.webview.postMessage({ command: 'run_finished' });
        lbtController.check_lbt_response();
        lbtController.update_build_summary_timestamp();
        BuildSummary_1.BuildSummary.update();
        //webviewView.webview.postMessage();
    }
    static update_build_summary_timestamp() {
        const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri
            : undefined;
        if (!rootPath)
            return;
        if (AppConfig_1.AppConfig.attributes_missing())
            return;
        const compile_list = LBTTools_1.lbtTools.get_compile_list(rootPath);
        lbtController.view_object._view?.webview.postMessage({
            command: 'update_build_summary_timestamp',
            build_summary_timestamp: compile_list ? compile_list['timestamp'] : undefined,
            build_counts: compile_list ? compile_list['compiles'].length : undefined
        });
    }
    static async update_current_profile() {
        await lbtController.update();
        lbtController.view_object._view?.webview.postMessage({
            command: 'update_current_profile',
            current_profile: AppConfig_1.AppConfig.get_current_profile_app_config_name()
        });
    }
    resolveWebviewView(webviewView, context, token) {
        this._view = webviewView;
        this._context = context;
        this._token = token;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "out"),
                vscode.Uri.joinPath(this._extensionUri, "asserts")
            ]
        };
        webviewView.retainContextWhenHidden = true;
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('No workspace defined');
            return;
        }
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri;
        const html_template = 'controller/index.html';
        const compile_list = LBTTools_1.lbtTools.get_compile_list(workspaceFolder);
        nunjucks.configure(Constants_1.Constants.HTML_TEMPLATE_DIR);
        const html = nunjucks.render(html_template, {
            global_stuff: LBTTools_1.lbtTools.get_global_stuff(webviewView.webview, this._extensionUri),
            config_profiles: AppConfig_1.AppConfig.get_profile_app_config_list(),
            main_java_script: (0, getUri_1.getUri)(webviewView.webview, this._extensionUri, ["out", "controller.js"]),
            build_summary_timestamp: compile_list ? compile_list['timestamp'] : undefined,
            builds_exist: compile_list ? compile_list['compiles'].length : undefined
        });
        webviewView.webview.html = html;
        lbtController.update_build_summary_timestamp();
        // Listener
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'test':
                    vscode.window.showInformationMessage('Message from controller');
                    break;
                case 'refresh':
                    this.resolveWebviewView(webviewView, context, token);
                    break;
                case 'run_build': // command:lbt.run_build
                    lbtController.current_run_type = data.command;
                    vscode.commands.executeCommand('lbt.run_build');
                    break;
                case 'run_single_build': // command:lbt.run_build
                    lbtController.current_run_type = data.command;
                    vscode.commands.executeCommand('lbt.run_single_build');
                    break;
                case 'show_changes':
                    lbtController.current_run_type = data.command;
                    vscode.commands.executeCommand('lbt.show_changes');
                    break;
                case 'show_single_changes':
                    lbtController.current_run_type = data.command;
                    vscode.commands.executeCommand('lbt.show_single_changes');
                    break;
                case 'cancel_running':
                    SystemCmdExecution_1.SystemCmdExecution.abort_system_cmd('show_changes');
                    SystemCmdExecution_1.SystemCmdExecution.abort_system_cmd('run_build');
                    LBTTools_1.lbtTools.cancel('retrieve_current_source_hashes');
                    break;
                case 'change_profile':
                    AppConfig_1.AppConfig.change_current_profile(data.profile);
                    LBTConfiguration_1.lbtConfiguration.update();
                    break;
                case 'copy_profile':
                    vscode.commands.executeCommand('lbt.copy-profile-config');
                    break;
                case 'delete_current_profile':
                    const current_profile = AppConfig_1.AppConfig.get_current_profile_app_config_file();
                    let ws = Workspace_1.Workspace.get_workspace_settings();
                    ws.current_profile = Constants_1.Constants.LBT_APP_CONFIG_USER;
                    Workspace_1.Workspace.update_workspace_settings(ws);
                    DirTool_1.DirTool.delete_file(path.join(Workspace_1.Workspace.get_workspace(), current_profile));
                    lbtController.update_current_profile();
                    break;
            }
        });
    }
    // lbt.source-filter.add-source-file
    static async copy_current_profile() {
        const current_profile = AppConfig_1.AppConfig.get_current_profile_app_config_name();
        const profile_list = AppConfig_1.AppConfig.get_profile_app_config_list();
        let new_profile_config = await vscode.window.showInputBox({ title: `Copy profile config ${current_profile}`,
            placeHolder: 'profile-name', validateInput(value) {
                if (value.trim() === '')
                    return 'Profile name cannot be empty';
                value = value.replace(' ', '-');
                value = value.replace('.toml', '');
                value = Constants_1.Constants.LBT_APP_CONFIG_USER.replace('.toml', `-${value}.toml`);
                if (profile_list.some((profile) => profile.file === value))
                    return `Profile ${value} already exists`;
                return null;
            } });
        if (!new_profile_config)
            throw new Error('Canceled by user. No new profile name provided.');
        new_profile_config = Constants_1.Constants.LBT_APP_CONFIG_USER.replace('.toml', `-${new_profile_config}.toml`);
        const new_profile_config_file = path.join(Constants_1.Constants.LBT_CONFIGS_DIR, new_profile_config);
        DirTool_1.DirTool.write_toml(path.join(Workspace_1.Workspace.get_workspace(), new_profile_config_file), AppConfig_1.AppConfig.get_user_app_config(Workspace_1.Workspace.get_workspace_uri()));
        AppConfig_1.AppConfig.change_current_profile(new_profile_config);
        lbtController.update_current_profile();
    }
}
exports.lbtController = lbtController;
lbtController.viewType = 'lbt.controller';
lbtController.is_config_watcher_set = false;
