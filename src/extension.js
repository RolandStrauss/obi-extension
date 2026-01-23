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
exports.activate = activate;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const BuildSummary_1 = require("./webview/show_changes/BuildSummary");
const lbtController_1 = require("./webview/controller/lbtController");
const SourceListProvider_1 = require("./webview/source_list/SourceListProvider");
const LBTCommands_1 = require("./lbt/LBTCommands");
const Welcome_1 = require("./webview/controller/Welcome");
const LBTTools_1 = require("./utilities/LBTTools");
const LBTConfiguration_1 = require("./webview/controller/LBTConfiguration");
const SSH_Tasks_1 = require("./utilities/SSH_Tasks");
const AppConfig_1 = require("./webview/controller/AppConfig");
const ConfigInvalid_1 = require("./webview/controller/ConfigInvalid");
const Logger_1 = require("./utilities/Logger");
const SourceInfos_1 = require("./webview/source_list/SourceInfos");
const LocaleText_1 = require("./utilities/LocaleText");
const Workspace_1 = require("./utilities/Workspace");
const DirTool_1 = require("./utilities/DirTool");
const I_Releaser_1 = require("./webview/deployment/I_Releaser");
const Constants_1 = require("./Constants");
const LBTSourceDependency_1 = require("./webview/controller/LBTSourceDependency");
const LocalSourceList_1 = require("./utilities/LocalSourceList");
const QuickSettings_1 = require("./webview/quick_settings/QuickSettings");
const BuildHistoryProvider_1 = require("./webview/build_history/BuildHistoryProvider");
function activate(context) {
    Logger_1.logger.info('Congratulations, your extension "lbt" is now active!');
    const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    const ws_uri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri
        : undefined;
    Logger_1.logger.info('Start app');
    Logger_1.logger.info(`vscode.env.remoteName: ${vscode.env.remoteName}`);
    Logger_1.logger.info(`vscode.env.uriScheme: ${vscode.env.uriScheme}`);
    Logger_1.logger.info(`vscode.env.appHost: ${vscode.env.appHost}`);
    Logger_1.logger.info(`vscode.env.appHost: ${vscode.env.remoteName}`);
    SSH_Tasks_1.SSH_Tasks.context = context;
    LBTTools_1.lbtTools.ext_context = context;
    // Add support for multi language
    LocaleText_1.LocaleText.init(vscode.env.language, context);
    //const fileUri = vscode.Uri.file('/home/andreas/projekte/opensource/extensions/lbt/README.md');
    //vscode.commands.executeCommand('vscode.open', fileUri);
    const contains_lbt_project = LBTTools_1.lbtTools.contains_lbt_project();
    vscode.commands.executeCommand('setContext', 'lbt.contains_lbt_project', contains_lbt_project);
    const lbt_welcome_provider = new Welcome_1.Welcome(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(Welcome_1.Welcome.viewType, lbt_welcome_provider));
    if (!contains_lbt_project) {
        return;
    }
    const lbt_config_invalid_provider = new ConfigInvalid_1.ConfigInvalid(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ConfigInvalid_1.ConfigInvalid.viewType, lbt_config_invalid_provider));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.controller.config', () => {
        LBTConfiguration_1.lbtConfiguration.render(context, context.extensionUri, '');
    }));
    vscode.commands.executeCommand('setContext', 'lbt.valid-config', false);
    var self_check_ok = true;
    try {
        LBTTools_1.lbtTools.self_check();
    }
    catch (e) {
        self_check_ok = false;
        vscode.window.showErrorMessage(e.message);
        LBTTools_1.lbtTools.reload_lbt_extension_on_config_change();
        return;
    }
    const config = AppConfig_1.AppConfig.get_app_config();
    if (config.attributes_missing()) {
        vscode.window.showErrorMessage("Config is not valid!");
        vscode.commands.executeCommand('lbt.controller.config');
        LBTTools_1.lbtTools.reload_lbt_extension_on_config_change();
        return;
    }
    vscode.commands.executeCommand('setContext', 'lbt.valid-config', true);
    context.subscriptions.push(vscode.commands.registerCommand('lbt.controller.dependency-list', () => {
        const fileUri = vscode.Uri.file(path.join(Workspace_1.Workspace.get_workspace(), config.general['dependency-list'] || Constants_1.Constants.DEPENDENCY_LIST));
        vscode.commands.executeCommand('vscode.open', fileUri);
    }));
    //--------------------------------------------------------
    // i-Releaser
    //--------------------------------------------------------
    const i_releaser = new I_Releaser_1.I_Releaser(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(I_Releaser_1.I_Releaser.viewType, i_releaser));
    /*context.subscriptions.push(
      vscode.commands.registerCommand('lbt.deployment.maintain', () => {
        DeploymentConfig.render(context)
      })
    );
    */
    //--------------------------------------------------------
    // Controller lbt
    //--------------------------------------------------------
    context.subscriptions.push(vscode.commands.registerCommand('lbt.get-remote-source-list', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.get_remote_source_list();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.copy-profile-config', () => {
        lbtController_1.lbtController.copy_current_profile();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.check-remote-sources', () => {
        // Only available with workspaces
        LBTTools_1.lbtTools.check_remote_sources().then((success) => {
            if (success) {
                vscode.window.showInformationMessage('Remote source check succeeded');
            }
            else {
                vscode.window.showWarningMessage('Remote source check failed');
            }
        });
    }));
    const run_native = LBTTools_1.lbtTools.without_local_lbt();
    vscode.commands.executeCommand('setContext', 'lbt.run_native', run_native);
    //SSH_Tasks.connect();
    context.subscriptions.push(vscode.commands.registerCommand('lbt.reset-compiled-object-list', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.reset_compiled_object_list();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.get-remote-compiled-object-list', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.get_remote_compiled_object_list();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.show_changes', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.show_changes(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.show_single_changes', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.show_single_changes(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.run_build', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.run_build(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.run_single_build', () => {
        // Only available with workspaces
        LBTCommands_1.lbtCommands.run_single_build(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.open_build_summary', (summary_file_path) => {
        // Only available with workspaces
        if (summary_file_path) {
            summary_file_path = LBTTools_1.lbtTools.convert_local_filepath_2_lbt_filepath(summary_file_path);
        }
        BuildSummary_1.BuildSummary.render(context.extensionUri, ws_uri, summary_file_path);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.transfer-all', () => {
        // Only available with workspaces
        LBTTools_1.lbtTools.transfer_project_folder(false);
    }));
    const lbt_controller_provider = new lbtController_1.lbtController(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(lbtController_1.lbtController.viewType, lbt_controller_provider));
    const quick_settings = new QuickSettings_1.QuickSettings(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(QuickSettings_1.QuickSettings.viewType, quick_settings));
    // Register Build History Tree View
    const buildHistoryProvider = new BuildHistoryProvider_1.BuildHistoryProvider(rootPath);
    buildHistoryProvider.register(context);
    // Register Source List Tree View
    const sourceListProvider = new SourceListProvider_1.SourceListProvider(rootPath);
    sourceListProvider.register(context);
    if (config.general['check-remote-source-on-startup'] && config.general['check-remote-source-on-startup'] === true) {
        LBTTools_1.lbtTools.check_remote_sources().then((success) => {
            if (success) {
                vscode.window.showInformationMessage('Remote source check succeeded');
            }
            else {
                vscode.window.showWarningMessage('Remote source check failed');
            }
        });
    }
    context.subscriptions.push(vscode.commands.registerCommand('lbt.source-filter.maintain-source-infos', () => {
        // Only available with workspaces
        SourceInfos_1.SourceInfos.render(context, true);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('lbt.source-filter.view-source-infos', () => {
        // Only available with workspaces
        SourceInfos_1.SourceInfos.render(context, false);
    }));
    vscode.commands.registerCommand('lbt.source.edit-compile-config', async (item) => {
        if (item instanceof SourceListProvider_1.SourceListItem) {
            LBTConfiguration_1.lbtConfiguration.render(context, context.extensionUri, `${item.src_lib}/${item.src_file}/${item.src_member}`);
        }
        if (item instanceof vscode.Uri) {
            const config = AppConfig_1.AppConfig.get_app_config();
            const src_dir = config.general['source-dir'] || 'src';
            let source_path = item.fsPath.replace(Workspace_1.Workspace.get_workspace() || '', '');
            source_path = source_path.replace(src_dir, '');
            source_path = source_path.replace('\\', '/');
            source_path = source_path.replace(/^\/+/, '');
            if (!DirTool_1.DirTool.file_exists(path.join(Workspace_1.Workspace.get_workspace() || '', src_dir, source_path))) {
                vscode.window.showErrorMessage(`Source ${source_path} not found in lbt project`);
                return;
            }
            LBTConfiguration_1.lbtConfiguration.render(context, context.extensionUri, `${source_path}`);
        }
    });
    vscode.commands.registerCommand('lbt.source.maintain-source-dependency', async (item) => {
        if (item instanceof SourceListProvider_1.SourceListItem) {
            LBTSourceDependency_1.lbtSourceDependency.render(context, context.extensionUri, `${item.src_lib}/${item.src_file}/${item.src_member}`);
        }
        if (item instanceof vscode.Uri) {
            const config = AppConfig_1.AppConfig.get_app_config();
            const src_dir = config.general['source-dir'] || 'src';
            let source_path = item.fsPath.replace(Workspace_1.Workspace.get_workspace(), '');
            source_path = source_path.replace(src_dir, '');
            source_path = source_path.replace(/\\/g, '/');
            source_path = source_path.replace(/^\/+/, '');
            if (!DirTool_1.DirTool.file_exists(path.join(Workspace_1.Workspace.get_workspace(), src_dir, source_path))) {
                vscode.window.showErrorMessage(`Source ${source_path} not found in lbt project`);
                return;
            }
            LBTSourceDependency_1.lbtSourceDependency.render(context, context.extensionUri, `${source_path}`);
        }
    });
    LocalSourceList_1.LocalSourceList.load_source_list();
}
