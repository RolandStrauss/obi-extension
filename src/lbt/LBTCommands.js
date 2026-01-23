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
exports.lbtCommands = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const BuildSummary_1 = require("../webview/show_changes/BuildSummary");
const LBTStatus_1 = require("./LBTStatus");
const lbtController_1 = require("../webview/controller/lbtController");
const LBTTools_1 = require("../utilities/LBTTools");
const Workspace_1 = require("../utilities/Workspace");
const SSH_Tasks_1 = require("../utilities/SSH_Tasks");
const AppConfig_1 = require("../webview/controller/AppConfig");
const path = __importStar(require("path"));
const DirTool_1 = require("../utilities/DirTool");
const Constants_1 = require("../Constants");
const Logger_1 = require("../utilities/Logger");
const SystemCmdExecution_1 = require("../utilities/SystemCmdExecution");
class lbtCommands {
    static async run_build_process(sources, generate_compile_list) {
        const ws = Workspace_1.Workspace.get_workspace();
        const config = AppConfig_1.AppConfig.get_app_config();
        const remote_base_dir = config.general['remote-base-dir'];
        const remote_lbt_dir = config.general['remote-lbt-dir'];
        if (!remote_base_dir || !remote_lbt_dir) {
            throw Error(`Missing 'remote_base_dir' or 'remote_lbt_dir'`);
        }
        const remote_lbt = await LBTTools_1.lbtTools.get_remote_lbt_python_path();
        if (!remote_lbt) {
            throw Error(`lbt path is not korrekt`);
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Run build`,
        }, async (progress) => {
            let ssh_cmd = '';
            progress.report({
                message: `Get changed source list`
            });
            let source_list = sources || [];
            if (!sources) {
                source_list = await LBTTools_1.lbtTools.generate_source_change_lists();
            }
            if (source_list.length == 0) {
                vscode.window.showWarningMessage("No changed sources to build");
                return;
            }
            // Ask if they should be build
            if (source_list.length > 0) {
                const source = `source${source_list.length > 1 ? 's' : ''}`;
                const answer = await vscode.window.showInformationMessage(`${source_list.length} ${source} will be build. Do you want to proceed?`, { modal: true }, ...['Yes', 'No']);
                switch (answer) {
                    case 'No':
                        return;
                    case undefined: // Canceled
                        return;
                }
            }
            if (!await LBTTools_1.lbtTools.check_remote_pase()) {
                vscode.window.showErrorMessage('Remote PASE is not configured correctly. Please check your configuration.');
                return false;
            }
            progress.report({
                message: `Check remote project folder`
            });
            let check = await LBTTools_1.lbtTools.check_remote();
            if (!check) {
                return false;
            }
            progress.report({
                message: `Count of source transfer: ${source_list.length}`
            });
            const result = await SSH_Tasks_1.SSH_Tasks.transferSources(source_list);
            if (generate_compile_list === false) {
                await lbtCommands.transfer_build_list(progress);
            }
            else {
                await lbtCommands.generate_build_script(progress, source_list);
            }
            progress.report({
                message: `Run build on IBM i`
            });
            await lbtCommands.execute_remote_build();
            progress.report({
                message: `Get all outputs back to you`
            });
            await lbtCommands.get_remote_build_output();
        });
    }
    static async generate_build_script(progress, source_list) {
        const config = AppConfig_1.AppConfig.get_app_config();
        const remote_base_dir = config.general['remote-base-dir'];
        const remote_lbt_dir = config.general['remote-lbt-dir'];
        const remote_lbt = await LBTTools_1.lbtTools.get_remote_lbt_python_path();
        if (!LBTTools_1.lbtTools.without_local_lbt() && config.general['local-lbt-dir']) {
            progress.report({
                message: `Generate build script by local lbt.`
            });
            let cmd = `${LBTTools_1.lbtTools.get_local_lbt_python_path()} -X utf8 ${path.join(config.general['local-lbt-dir'], 'main.py')} -a create -p .`;
            if (source_list.length == 1) {
                const quote = process.platform === 'win32' ? '"' : "'";
                cmd = `${cmd} --source=${quote}${source_list[0]}${quote}`;
            }
            Logger_1.logger.info(`CMD: ${cmd}`);
            try {
                await SystemCmdExecution_1.SystemCmdExecution.run_system_cmd(Workspace_1.Workspace.get_workspace(), cmd, 'generate_build_script');
            }
            catch (error) {
                if (error.signal === 'SIGTERM') {
                    vscode.window.showErrorMessage('Build script generation was terminated.');
                }
                throw error;
            }
            await lbtCommands.transfer_build_list(progress);
        }
        else {
            progress.report({
                message: `Generate build script on remote. If it takes too long, use lbt locally (see documentation).`
            });
            let ssh_cmd = `cd '${remote_base_dir}' || exit 1; rm log/* .lbt/log/* 2> /dev/null || true; ${remote_lbt} -X utf8 ${remote_lbt_dir}/main.py -a create -p .`;
            if (source_list.length == 1) {
                const quote = process.platform === 'win32' ? '"' : "'";
                ssh_cmd = `${ssh_cmd} --source=${quote}${source_list[0]}${quote}`;
            }
            await SSH_Tasks_1.SSH_Tasks.executeCommand(ssh_cmd);
        }
    }
    static async transfer_build_list(progress) {
        const config = AppConfig_1.AppConfig.get_app_config();
        progress.report({
            message: `Transfer build list to remote.`
        });
        await SSH_Tasks_1.SSH_Tasks.transfer_files([config.general['compile-list']]);
        await SSH_Tasks_1.SSH_Tasks.transfer_dir(path.join(Workspace_1.Workspace.get_workspace(), Constants_1.Constants.LBT_TMP_DIR), `${config.general['remote-base-dir']}/${Constants_1.Constants.LBT_TMP_DIR}`);
    }
    static async execute_remote_build() {
        const config = AppConfig_1.AppConfig.get_app_config();
        const remote_base_dir = config.general['remote-base-dir'];
        const remote_lbt_dir = config.general['remote-lbt-dir'];
        const remote_lbt = await LBTTools_1.lbtTools.get_remote_lbt_python_path();
        const ssh_cmd = `cd '${remote_base_dir}' || exit 1; rm log/* .lbt/log/* 2> /dev/null || true; ${remote_lbt} -X utf8 ${remote_lbt_dir}/main.py -a run -p .`;
        await SSH_Tasks_1.SSH_Tasks.executeCommand(ssh_cmd);
    }
    static async get_remote_build_output() {
        const config = AppConfig_1.AppConfig.get_app_config();
        const remote_base_dir = config.general['remote-base-dir'];
        const ws = Workspace_1.Workspace.get_workspace();
        const ws_uri = Workspace_1.Workspace.get_workspace_uri();
        let promise_list = [
            SSH_Tasks_1.SSH_Tasks.getRemoteDir(path.join(ws, Constants_1.Constants.BUILD_OUTPUT_DIR), `${remote_base_dir}/${Constants_1.Constants.BUILD_OUTPUT_DIR}`),
            SSH_Tasks_1.SSH_Tasks.getRemoteDir(path.join(ws, '.lbt', 'tmp'), `${remote_base_dir}/.lbt/tmp`),
            SSH_Tasks_1.SSH_Tasks.getRemoteDir(path.join(ws, '.lbt', 'log'), `${remote_base_dir}/.lbt/log`)
        ];
        await Promise.all(promise_list);
        if (DirTool_1.DirTool.file_exists(path.join(ws, config.general['compile-list']))) {
            const compile_list = LBTTools_1.lbtTools.get_compile_list(ws_uri) || {};
            const timestamp = compile_list['timestamp'] || new Date().toISOString();
            DirTool_1.DirTool.write_json(path.join(ws, Constants_1.Constants.BUILD_HISTORY_DIR, `${timestamp.replaceAll(":", ".")}.json`), compile_list);
            const sources = LBTTools_1.lbtTools.get_sources_info_from_compile_list();
            const source_hashes = LBTTools_1.lbtTools.get_source_hash_list(Workspace_1.Workspace.get_workspace()) || {};
            for (const source of sources) {
                if (source.status == 'success') {
                    source_hashes[source.source] = source.hash;
                }
            }
            DirTool_1.DirTool.write_json(path.join(ws, config.general['compiled-object-list']), source_hashes);
        }
    }
    static get_current_active_source() {
        if (!vscode.window.activeTextEditor) {
            vscode.window.showWarningMessage('No active source');
            return undefined;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        let source = vscode.window.activeTextEditor.document.fileName.replace(path.join(Workspace_1.Workspace.get_workspace(), AppConfig_1.AppConfig.get_app_config().general['source-dir'] || 'src'), '');
        source = source.replaceAll('\\', '/');
        if (source.charAt(0) == '/') {
            source = source.substring(1);
        }
        if (!config.general['supported-object-types'].includes(source.split('.').pop())) {
            vscode.window.showWarningMessage(`${source} is not a supported source type`);
            return undefined;
        }
        if (!DirTool_1.DirTool.file_exists(path.join(Workspace_1.Workspace.get_workspace(), config.general['source-dir'], source))) {
            vscode.window.showWarningMessage(`${source} does not exist in current source directory (${path.join(Workspace_1.Workspace.get_workspace(), config.general['source-dir'])})`);
            return undefined;
        }
        Logger_1.logger.info(`Source: ${source}`);
        return source;
    }
    static async run_single_build(context) {
        const source = lbtCommands.get_current_active_source();
        if (!source) {
            return lbtController_1.lbtController.run_finished();
        }
        lbtCommands.run_build(context, source);
    }
    static async run_build(context, source) {
        if (lbtCommands.run_build_status != LBTStatus_1.lbtStatus.READY) {
            vscode.window.showErrorMessage('lbt process is already running');
            return;
        }
        await lbtCommands.show_changes(context, source);
        await lbtCommands.rerun_build([], {});
        return;
    }
    static async rerun_build(ignore_sources, ignore_sources_cmd) {
        if (lbtCommands.run_build_status != LBTStatus_1.lbtStatus.READY) {
            vscode.window.showErrorMessage('lbt process is already running');
            return;
        }
        lbtCommands.run_build_status = LBTStatus_1.lbtStatus.IN_PROCESS;
        try {
            LBTTools_1.lbtTools.update_compile_list(ignore_sources, ignore_sources_cmd);
            const sources = LBTTools_1.lbtTools.get_sources_2_build_from_compile_list(true);
            if (sources.length > 0) {
                await lbtCommands.run_build_process(sources, false);
            }
            else {
                vscode.window.showInformationMessage('No sources to build');
            }
            BuildSummary_1.BuildSummary.update();
            lbtController_1.lbtController.update_build_summary_timestamp();
        }
        catch (e) {
            vscode.window.showErrorMessage(e.message);
        }
        lbtCommands.run_build_status = LBTStatus_1.lbtStatus.READY;
        lbtController_1.lbtController.run_finished();
        return;
    }
    static async show_single_changes(context) {
        const source = lbtCommands.get_current_active_source();
        if (!source) {
            return lbtController_1.lbtController.run_finished();
        }
        lbtCommands.show_changes(context, source);
    }
    static async show_changes(context, source) {
        if (lbtCommands.show_changes_status != LBTStatus_1.lbtStatus.READY) {
            vscode.window.showErrorMessage('lbt process is already running');
            return;
        }
        lbtCommands.show_changes_status = LBTStatus_1.lbtStatus.IN_PROCESS;
        const ws = Workspace_1.Workspace.get_workspace();
        const config = AppConfig_1.AppConfig.get_app_config();
        try {
            if (LBTTools_1.lbtTools.without_local_lbt()) {
                await LBTTools_1.lbtTools.generate_source_change_lists(source);
            }
            else {
                Logger_1.logger.info(`WS: ${Workspace_1.Workspace.get_workspace()}`);
                let cmd = `${LBTTools_1.lbtTools.get_local_lbt_python_path()} -X utf8 ${path.join(config.general['local-lbt-dir'], 'main.py')} -a create -p .`;
                if (source) {
                    const quote = process.platform === 'win32' ? '"' : "'";
                    cmd = `${cmd} --source=${quote}${source}${quote}`;
                }
                Logger_1.logger.info(`CMD: ${cmd}`);
                await SystemCmdExecution_1.SystemCmdExecution.run_system_cmd(Workspace_1.Workspace.get_workspace(), cmd, 'show_changes');
            }
            BuildSummary_1.BuildSummary.render(context.extensionUri, Workspace_1.Workspace.get_workspace_uri());
        }
        catch (error) {
            Logger_1.logger.error(error, error.stack);
            vscode.window.showInformationMessage(error.message, { modal: true });
        }
        lbtCommands.show_changes_status = LBTStatus_1.lbtStatus.READY;
        lbtController_1.lbtController.run_finished();
        lbtController_1.lbtController.update_build_summary_timestamp();
        return;
    }
    static async run_system_cmd(cwd, cmd) {
        //const stdout = execSync(cmd, { cwd: cwd });
        const child = (0, child_process_1.fork)(cmd, { cwd: cwd });
        (0, child_process_1.spawn)(cmd, { cwd: cwd, shell: true });
        return child;
    }
    static async reset_compiled_object_list() {
        if (lbtCommands.reset_compiled_object_list_status != LBTStatus_1.lbtStatus.READY) {
            vscode.window.showErrorMessage('lbt process is already running');
            return;
        }
        lbtCommands.reset_compiled_object_list_status = LBTStatus_1.lbtStatus.IN_PROCESS;
        const config = AppConfig_1.AppConfig.get_app_config();
        try {
            if (!config.general['compiled-object-list']) {
                throw Error(`Invalid config for config.general['compiled-object-list']: ${config.general['compiled-object-list']}`);
            }
            const object_list_file = config.general['compiled-object-list'];
            let json_dict = {};
            const source_hashes = await LBTTools_1.lbtTools.retrieve_current_source_hashes();
            source_hashes.map((source) => {
                const source_name = Object.keys(source)[0];
                json_dict[source_name.replaceAll('\\', '/')] = source[source_name];
            });
            DirTool_1.DirTool.write_json(path.join(Workspace_1.Workspace.get_workspace(), object_list_file), json_dict);
            vscode.window.showInformationMessage(`Object list created`);
            //await SSH_Tasks.transfer_files([object_list_file]);
            //vscode.window.showInformationMessage(`Object list transfered to IBM i`);
        }
        catch (e) {
            vscode.window.showErrorMessage(e.message);
        }
        lbtCommands.reset_compiled_object_list_status = LBTStatus_1.lbtStatus.READY;
        return;
    }
    /**
     * Generates remote source list.
     *
     * It's similar to object list.
     *
     * @returns
     */
    static async get_remote_source_list() {
        if (lbtCommands.remote_source_list_status != LBTStatus_1.lbtStatus.READY) {
            vscode.window.showErrorMessage('lbt process is already running');
            return;
        }
        lbtCommands.remote_source_list_status = LBTStatus_1.lbtStatus.IN_PROCESS;
        try {
            const ws = Workspace_1.Workspace.get_workspace();
            const config = AppConfig_1.AppConfig.get_app_config();
            const remote_base_dir = config.general['remote-base-dir'];
            const remote_lbt_dir = config.general['remote-lbt-dir'];
            if (!remote_base_dir || !remote_lbt_dir) {
                throw Error(`Missing 'remote_base_dir' or 'remote_lbt_dir'`);
            }
            const remote_lbt = `${config.general['remote-lbt-dir']}/venv/bin/python`;
            await SSH_Tasks_1.SSH_Tasks.transfer_files([Constants_1.Constants.LBT_APP_CONFIG_FILE, Constants_1.Constants.LBT_APP_CONFIG_USER_FILE]);
            let ssh_cmd = `cd '${remote_base_dir}' || exit 1; rm log/* .lbt/log/* 2>/dev/null || true; ${remote_lbt} -X utf8 ${remote_lbt_dir}/main.py -a gen_src_list -p .`;
            await SSH_Tasks_1.SSH_Tasks.executeCommand(ssh_cmd);
            if (config.general['remote-source-list'] && config.general['source-list']) {
                await SSH_Tasks_1.SSH_Tasks.getRemoteFile(path.join(ws, config.general['remote-source-list']), `${remote_base_dir}/${config.general['source-list']}`);
            }
            vscode.window.showInformationMessage('Remote source list transfered from remote');
        }
        catch (e) {
            lbtCommands.remote_source_list_status = LBTStatus_1.lbtStatus.READY;
            vscode.window.showErrorMessage(e.message);
            vscode.window.showErrorMessage('Failed to get remote source list');
            Logger_1.logger.error(e.message, e.stack);
            throw e;
        }
        lbtCommands.remote_source_list_status = LBTStatus_1.lbtStatus.READY;
        return;
    }
    static async get_remote_compiled_object_list() {
        const config = AppConfig_1.AppConfig.get_app_config();
        const remote_base_dir = config.general['remote-base-dir'];
        const remote_lbt_dir = config.general['remote-lbt-dir'];
        if (!remote_base_dir || !remote_lbt_dir) {
            throw Error(`Missing config 'remote-base-dir' or 'remote-lbt-dir'`);
        }
        if (!config.general['compiled-object-list']) {
            throw Error(`Missing config 'compiled-object-list'`);
        }
        await SSH_Tasks_1.SSH_Tasks.getRemoteFile(path.join(Workspace_1.Workspace.get_workspace(), config.general['compiled-object-list']), `${remote_base_dir}/${config.general['compiled-object-list']}`);
        vscode.window.showInformationMessage('Compiled object list transfered from remote');
    }
    static show_build_summary(file) {
        // Display build summary panel for specified file or current selection
        if (!file) {
            return;
        }
        // TODO: Implement build summary display logic
    }
    static delete_compile_list_item(level, source) {
        // Remove item from compile list
        if (!level || !source) {
            return;
        }
        // TODO: Implement compile list item deletion
    }
    static delete_compile_list_level(level) {
        // Remove entire level from compile list
        if (!level) {
            return;
        }
        // TODO: Implement compile list level deletion
    }
}
exports.lbtCommands = lbtCommands;
lbtCommands.run_build_status = LBTStatus_1.lbtStatus.READY;
lbtCommands.show_changes_status = LBTStatus_1.lbtStatus.READY;
lbtCommands.remote_source_list_status = LBTStatus_1.lbtStatus.READY;
lbtCommands.reset_compiled_object_list_status = LBTStatus_1.lbtStatus.READY;
