import * as path from 'path';
import * as vscode from 'vscode';
import { BuildSummary } from './webview/show_changes/BuildSummary';
import { ldmController } from './webview/controller/ldmController';
import { SourceListItem, SourceListProvider } from './webview/source_list/SourceListProvider';
import { ldmCommands } from './ldm/ldmCommands';
import { Welcome } from './webview/controller/Welcome';
import { ldmTools } from './utilities/ldmTools';
import { ldmConfiguration } from './webview/controller/ldmConfiguration';
import { SSH_Tasks } from './utilities/SSH_Tasks';
import { AppConfig } from './webview/controller/AppConfig';
import { ConfigInvalid } from './webview/controller/ConfigInvalid';
import { logger } from './utilities/Logger';
import { SourceInfos } from './webview/source_list/SourceInfos';
import { LocaleText } from './utilities/LocaleText';
import { Workspace } from './utilities/Workspace';
import { ldmSourceConfiguration } from './webview/controller/ldmSourceConfiguration';
import { DirTool } from './utilities/DirTool';
import { I_Releaser } from './webview/deployment/I_Releaser';
import { Constants } from './Constants';
import { ldmSourceDependency } from './webview/controller/ldmSourceDependency';
import { LocalSourceList } from './utilities/LocalSourceList';
import { QuickSettings } from './webview/quick_settings/QuickSettings';
import { BuildHistoryProvider } from './webview/build_history/BuildHistoryProvider';


export function activate(context: vscode.ExtensionContext) {

	logger.info('Congratulations, your extension "ldm" is now active!');
	const rootPath =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined;
	const ws_uri =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri
			: undefined;

	logger.info('Start app');

	logger.info(`vscode.env.remoteName: ${vscode.env.remoteName}`);
	logger.info(`vscode.env.uriScheme: ${vscode.env.uriScheme}`);
	logger.info(`vscode.env.appHost: ${vscode.env.appHost}`);
	logger.info(`vscode.env.appHost: ${vscode.env.remoteName}`);

	SSH_Tasks.context = context;
	ldmTools.ext_context = context;


	// Add support for multi language
	LocaleText.init(vscode.env.language, context);

	//const fileUri = vscode.Uri.file('/home/andreas/projekte/opensource/extensions/ldm/README.md');
	//vscode.commands.executeCommand('vscode.open', fileUri);

	const contains_ldm_project: boolean = ldmTools.contains_ldm_project();
	vscode.commands.executeCommand('setContext', 'ldm.contains_ldm_project', contains_ldm_project);

	const ldm_welcome_provider = new Welcome(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(Welcome.viewType, ldm_welcome_provider)
	);

	if (!contains_ldm_project)
		return;

	const ldm_config_invalid_provider = new ConfigInvalid(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ConfigInvalid.viewType, ldm_config_invalid_provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.controller.config', () => {
			ldmConfiguration.render(context, context.extensionUri)
		})
	)

	vscode.commands.executeCommand('setContext', 'ldm.valid-config', false);

	var self_check_ok: boolean = true;
	try {
		ldmTools.self_check();
	}
	catch (e: any) {
		self_check_ok = false;
		vscode.window.showErrorMessage(e.message);
		ldmTools.reload_ldm_extension_on_config_change();
		return;
	}

	const config = AppConfig.get_app_config();
	if (config.attributes_missing()) {
		vscode.window.showErrorMessage("Config is not valid!");
		vscode.commands.executeCommand('ldm.controller.config');
		ldmTools.reload_ldm_extension_on_config_change();
		return;
	}

	vscode.commands.executeCommand('setContext', 'ldm.valid-config', true);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.controller.dependency-list', () => {
			const fileUri = vscode.Uri.file(path.join(Workspace.get_workspace(), config.general['dependency-list'] || Constants.DEPENDENCY_LIST));
			vscode.commands.executeCommand('vscode.open', fileUri);
		})
	)

	//--------------------------------------------------------
	// i-Releaser
	//--------------------------------------------------------
	const i_releaser = new I_Releaser(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(I_Releaser.viewType, i_releaser)
	);

	/*context.subscriptions.push(
		vscode.commands.registerCommand('ldm.deployment.maintain', () => {
			DeploymentConfig.render(context)
		})
	);
	*/


	//--------------------------------------------------------
	// Controller ldm
	//--------------------------------------------------------
	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.get-remote-source-list', () => {
			// Only available with workspaces
			ldmCommands.get_remote_source_list();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.copy-profile-config', () => {
			ldmController.copy_current_profile()
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.check-remote-sources', () => {
			// Only available with workspaces
			ldmTools.check_remote_sources().then((success) => {
				if (success)
					vscode.window.showInformationMessage('Remote source check succeeded');
				else
					vscode.window.showWarningMessage('Remote source check failed');
			});
		})
	);

	const run_native: boolean = ldmTools.without_local_ldm();
	vscode.commands.executeCommand('setContext', 'ldm.run_native', run_native);

	//SSH_Tasks.connect();


	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.reset-compiled-object-list', () => {
			// Only available with workspaces
			ldmCommands.reset_compiled_object_list();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.get-remote-compiled-object-list', () => {
			// Only available with workspaces
			ldmCommands.get_remote_compiled_object_list();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.show_changes', () => {
			// Only available with workspaces
			ldmCommands.show_changes(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.show_single_changes', () => {
			// Only available with workspaces
			ldmCommands.show_single_changes(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.run_build', () => {
			// Only available with workspaces
			ldmCommands.run_build(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.run_single_build', () => {
			// Only available with workspaces
			ldmCommands.run_single_build(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.open_build_summary', (summary_file_path?: string) => {
			// Only available with workspaces
			if (summary_file_path) {
				summary_file_path = ldmTools.convert_local_filepath_2_ldm_filepath(summary_file_path);
			}
			BuildSummary.render(context.extensionUri, ws_uri, summary_file_path);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.transfer-all', () => {
			// Only available with workspaces
			ldmTools.transfer_project_folder(false);
		})
	);

	const ldm_controller_provider = new ldmController(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ldmController.viewType, ldm_controller_provider)
	);

	const quick_settings = new QuickSettings(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(QuickSettings.viewType, quick_settings)
	);

	// Register Build History Tree View
	const buildHistoryProvider = new BuildHistoryProvider(rootPath);
	buildHistoryProvider.register(context);

	// Register Source List Tree View
	const sourceListProvider: SourceListProvider = new SourceListProvider(rootPath);
	sourceListProvider.register(context);


	if (config.general['check-remote-source-on-startup'] && config.general['check-remote-source-on-startup'] === true) {
		ldmTools.check_remote_sources().then((success) => {
			if (success)
				vscode.window.showInformationMessage('Remote source check succeeded');
			else
				vscode.window.showWarningMessage('Remote source check failed');
		});
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.source-filter.maintain-source-infos', () => {
			// Only available with workspaces
			SourceInfos.render(context, true);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('ldm.source-filter.view-source-infos', () => {
			// Only available with workspaces
			SourceInfos.render(context, false);
		})
	);


	vscode.commands.registerCommand('ldm.source.edit-compile-config', async (item: SourceListItem | vscode.Uri) => {

		if (item instanceof SourceListItem)
			ldmSourceConfiguration.render(context, context.extensionUri, `${item.src_lib}/${item.src_file}/${item.src_member}`);

		if (item instanceof vscode.Uri) {

			const config: AppConfig = AppConfig.get_app_config();
			const src_dir: string = config.general['source-dir'] || 'src';
			let source_path: string = item.fsPath.replace(Workspace.get_workspace(), '')
			source_path = source_path.replace(src_dir, '');
			source_path = source_path.replace('\\', '/');
			source_path = source_path.replace(/^\/+/, '');

			if (!DirTool.file_exists(path.join(Workspace.get_workspace(), src_dir, source_path))) {
				vscode.window.showErrorMessage(`Source ${source_path} not found in ldm project`);
				return;
			}

			ldmSourceConfiguration.render(context, context.extensionUri, `${source_path}`);
		}

	});


	vscode.commands.registerCommand('ldm.source.maintain-source-dependency', async (item: SourceListItem | vscode.Uri) => {

		if (item instanceof SourceListItem)
			ldmSourceDependency.render(context, context.extensionUri, `${item.src_lib}/${item.src_file}/${item.src_member}`);

		if (item instanceof vscode.Uri) {

			const config: AppConfig = AppConfig.get_app_config();
			const src_dir: string = config.general['source-dir'] || 'src';
			let source_path: string = item.fsPath.replace(Workspace.get_workspace(), '')
			source_path = source_path.replace(src_dir, '');
			source_path = source_path.replace(/\\/g, '/');
			source_path = source_path.replace(/^\/+/, '');

			if (!DirTool.file_exists(path.join(Workspace.get_workspace(), src_dir, source_path))) {
				vscode.window.showErrorMessage(`Source ${source_path} not found in ldm project`);
				return;
			}

			ldmSourceDependency.render(context, context.extensionUri, `${source_path}`);
		}

	});

	LocalSourceList.load_source_list();

}
