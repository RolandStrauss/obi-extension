import * as vscode from 'vscode';

import { fork, spawn } from "child_process";
import { BuildSummary } from '../webview/show_changes/BuildSummary';
import { LBRStatus } from './LBRStatus';
import { LBRController } from '../webview/controller/LBRController';
import { LBRTools } from '../utilities/LBRTools';
import { Workspace } from '../utilities/Workspace';

import * as source from '../lbr/Source';
import { SSH_Tasks } from '../utilities/SSH_Tasks';
import { AppConfig } from '../webview/controller/AppConfig';
import * as path from 'path';
import { DirTool } from '../utilities/DirTool';
import { Constants } from '../Constants';
import { logger } from '../utilities/Logger';
import { SystemCmdExecution } from '../utilities/SystemCmdExecution';
import { Uri } from 'vscode';



export class LBRCommands {


  public static run_build_status: LBRStatus = LBRStatus.READY;
  public static show_changes_status: LBRStatus = LBRStatus.READY;
  public static remote_source_list_status: LBRStatus = LBRStatus.READY;
  public static reset_compiled_object_list_status: LBRStatus = LBRStatus.READY;



  public static async run_build_process(sources?: string[], generate_compile_list?: boolean) {

    const ws = Workspace.get_workspace();
    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const remote_lbr_dir: string | undefined = config.general['remote-lbr-dir'];

    if (!remote_base_dir || !remote_lbr_dir)
      throw Error(`Missing 'remote_base_dir' or 'remote_lbr_dir'`);

    const remote_lbr: string | undefined = await LBRTools.get_remote_lbr_python_path();
    if (!remote_lbr)
      throw Error(`LBR path is not korrekt`);

    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Run build`,
    },
      async progress => {

        let ssh_cmd: string = '';

        progress.report({
          message: `Get changed source list`
        });

        let source_list: string[] = sources || [];
        if (!sources)
          source_list = await LBRTools.generate_source_change_lists();

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

        if (! await LBRTools.check_remote_pase()){
          vscode.window.showErrorMessage('Remote PASE is not configured correctly. Please check your configuration.');
          return false;
        }

        progress.report({
          message: `Check remote project folder`
        });

        let check: boolean = await LBRTools.check_remote();

        if (!check) {
          return false;
        }

        progress.report({
          message: `Count of source transfer: ${source_list.length}`
        });
        const result = await SSH_Tasks.transferSources(source_list);

        if (generate_compile_list === false)
          await LBRCommands.transfer_build_list(progress);
        else
          await LBRCommands.generate_build_script(progress, source_list);


        progress.report({
          message: `Run build on IBM i`
        });

        await LBRCommands.execute_remote_build();

        progress.report({
          message: `Get all outputs back to you`
        });

        await LBRCommands.get_remote_build_output();

      });
  }



  public static async generate_build_script(progress: vscode.Progress<{
    message?: string;
    increment?: number;
  }>, source_list: string[]) {

    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const remote_lbr_dir: string | undefined = config.general['remote-lbr-dir'];
    const remote_lbr: string | undefined = await LBRTools.get_remote_lbr_python_path();

    if (!LBRTools.without_local_lbr() && config.general['local-lbr-dir']) {

      progress.report({
        message: `Generate build script by local LBR.`
      });

      let cmd = `${LBRTools.get_local_lbr_python_path()} -X utf8 ${path.join(config.general['local-lbr-dir'], 'main.py')} -a create -p .`;

      if (source_list.length == 1) {
        const quote = process.platform === 'win32' ? '"' : "'";
        cmd = `${cmd} --source=${quote}${source_list[0]}${quote}`;
      }
      logger.info(`CMD: ${cmd}`);

      try {
        await SystemCmdExecution.run_system_cmd(Workspace.get_workspace(), cmd, 'generate_build_script');
      } catch (error: any) {
        if (error.signal === 'SIGTERM') {
          vscode.window.showErrorMessage('Build script generation was terminated.');
        }
        throw error;
      }

      await LBRCommands.transfer_build_list(progress);
    }
    else {

      progress.report({
        message: `Generate build script on remote. If it takes too long, use LBR localy (see documentation).`
      });
      let ssh_cmd: string = `cd '${remote_base_dir}' || exit 1; rm log/* .lbr/log/* 2> /dev/null || true; ${remote_lbr} -X utf8 ${remote_lbr_dir}/main.py -a create -p .`;
      if (source_list.length == 1) {
        const quote = process.platform === 'win32' ? '"' : "'";
        ssh_cmd = `${ssh_cmd} --source=${quote}${source_list[0]}${quote}`;
      }
      await SSH_Tasks.executeCommand(ssh_cmd);

    }
  }



  public static async transfer_build_list(progress: vscode.Progress<{
    message?: string;
    increment?: number;
  }>) {

    const config = AppConfig.get_app_config();

    progress.report({
      message: `Transfer build list to remote.`
    });
    await SSH_Tasks.transfer_files([config.general['compile-list']]);
    await SSH_Tasks.transfer_dir(path.join(Workspace.get_workspace(), Constants.LBR_TMP_DIR), `${config.general['remote-base-dir']}/${Constants.LBR_TMP_DIR}`);

  }





  public static async execute_remote_build() {

    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const remote_lbr_dir: string | undefined = config.general['remote-lbr-dir'];
    const remote_lbr: string | undefined = await LBRTools.get_remote_lbr_python_path();
    const ssh_cmd: string = `cd '${remote_base_dir}' || exit 1; rm log/* .lbr/log/* 2> /dev/null || true; ${remote_lbr} -X utf8 ${remote_lbr_dir}/main.py -a run -p .`;
    await SSH_Tasks.executeCommand(ssh_cmd);
  }



  public static async get_remote_build_output() {

    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const ws: string = Workspace.get_workspace();
    const ws_uri: Uri = Workspace.get_workspace_uri();

    let promise_list = [
      SSH_Tasks.getRemoteDir(path.join(ws, Constants.BUILD_OUTPUT_DIR), `${remote_base_dir}/${Constants.BUILD_OUTPUT_DIR}`),
      SSH_Tasks.getRemoteDir(path.join(ws, '.lbr', 'tmp'), `${remote_base_dir}/.lbr/tmp`),
      SSH_Tasks.getRemoteDir(path.join(ws, '.lbr', 'log'), `${remote_base_dir}/.lbr/log`)
    ];

    await Promise.all(promise_list);

    if (DirTool.file_exists(path.join(ws, config.general['compile-list']))) {

      const compile_list: {} = LBRTools.get_compile_list(ws_uri) || {};
      const timestamp: string = compile_list['timestamp'] || new Date().toISOString();
      // Windows compatibility for directory name
      const historyDirName = timestamp.replace(":", ".").replace(" ", "_");
      const historyDir = path.join(ws, Constants.BUILD_HISTORY_DIR, historyDirName);
      DirTool.write_json(path.join(historyDir, 'compile-list.json'), compile_list);
      DirTool.copy_dir(path.join(ws, Constants.LBR_TMP_DIR), historyDir);

      const sources: source.SourceCompileList[] = LBRTools.get_sources_info_from_compile_list();
      const source_hashes: source.ISource = LBRTools.get_source_hash_list(Workspace.get_workspace()) || {};

      for (const source of sources) {
        if (source.status == 'success') {
          source_hashes[source.source] = source.hash;
        }
      }
      DirTool.write_json(path.join(ws, config.general['compiled-object-list']), source_hashes);
    }
  }



  public static get_current_active_source(): string | undefined {

    if (!vscode.window.activeTextEditor) {
      vscode.window.showWarningMessage('No active source');
      return undefined;
    }

    const config = AppConfig.get_app_config();

    let source = vscode.window.activeTextEditor.document.fileName.replace(path.join(Workspace.get_workspace(), AppConfig.get_app_config().general['source-dir'] || 'src'), '');
    source = source.replaceAll('\\', '/');
    if (source.charAt(0) == '/')
      source = source.substring(1);

    if (!config.general['supported-object-types'].includes(source.split('.').pop())) {
      vscode.window.showWarningMessage(`${source} is not a supported source type`);
      return undefined;
    }

    if (!DirTool.file_exists(path.join(Workspace.get_workspace(), config.general['source-dir'], source))) {
      vscode.window.showWarningMessage(`${source} does not exist in current source directory (${path.join(Workspace.get_workspace(), config.general['source-dir'])})`);
      return undefined;
    }

    logger.info(`Source: ${source}`);

    return source
  }



  public static async run_single_build(context: vscode.ExtensionContext) {

    const source = LBRCommands.get_current_active_source();

    if (!source)
      return LBRController.run_finished();

    LBRCommands.run_build(context, source);
  }




  public static async run_build(context: vscode.ExtensionContext, source?: string) {

    if (LBRCommands.run_build_status != LBRStatus.READY) {
      vscode.window.showErrorMessage('LBR process is already running');
      return;
    }

    await LBRCommands.show_changes(context, source);

    await LBRCommands.rerun_build([], {});

    return;
  }




  public static async rerun_build(ignore_sources: string[], ignore_sources_cmd: { [key: string]: [string] | null }) {

    if (LBRCommands.run_build_status != LBRStatus.READY) {
      vscode.window.showErrorMessage('LBR process is already running');
      return;
    }

    LBRCommands.run_build_status = LBRStatus.IN_PROCESS;

    try {

      LBRTools.update_compile_list(ignore_sources, ignore_sources_cmd);

      const sources: string[] = LBRTools.get_sources_2_build_from_compile_list(true);
      if (sources.length > 0) {
        await LBRCommands.run_build_process(sources, false);
      }
      else {
        vscode.window.showInformationMessage('No sources to build');
      }

      BuildSummary.update();
      LBRController.update_build_summary_timestamp();
    }
    catch (e: any) {
      vscode.window.showErrorMessage(e.message);
    }

    LBRCommands.run_build_status = LBRStatus.READY;
    LBRController.run_finished();
    return;
  }



  public static async show_single_changes(context: vscode.ExtensionContext) {
    const source = LBRCommands.get_current_active_source();

    if (!source)
      return LBRController.run_finished();

    LBRCommands.show_changes(context, source);
  }




  public static async show_changes(context: vscode.ExtensionContext, source?: string) {

    if (LBRCommands.show_changes_status != LBRStatus.READY) {
      vscode.window.showErrorMessage('LBR process is already running');
      return;
    }

    LBRCommands.show_changes_status = LBRStatus.IN_PROCESS;

    const ws: string = Workspace.get_workspace();
    const config = AppConfig.get_app_config();

    try {
      if (LBRTools.without_local_lbr())
        await LBRTools.generate_source_change_lists(source);
      else {
        logger.info(`WS: ${Workspace.get_workspace()}`);
        let cmd = `${LBRTools.get_local_lbr_python_path()} -X utf8 ${path.join(config.general['local-lbr-dir'], 'main.py')} -a create -p .`;
        if (source) {
          const quote = process.platform === 'win32' ? '"' : "'";
          cmd = `${cmd} --source=${quote}${source}${quote}`;
        }
        logger.info(`CMD: ${cmd}`);

        await SystemCmdExecution.run_system_cmd(Workspace.get_workspace(), cmd, 'show_changes');
      }

      BuildSummary.render(context.extensionUri, Workspace.get_workspace_uri());
    }
    catch (error: any) {

      logger.error(error, error.stack);
      vscode.window.showInformationMessage(error.message, { modal: true });
    }

    LBRCommands.show_changes_status = LBRStatus.READY;
    LBRController.run_finished();
    LBRController.update_build_summary_timestamp();

    return;
  }




  public static async run_system_cmd(cwd: string, cmd: string) {

    //const stdout = execSync(cmd, { cwd: cwd });
    const child = fork(cmd, { cwd: cwd });
    spawn(cmd, { cwd: cwd, shell: true });
    return child;
  }




  public static async reset_compiled_object_list() {

    if (LBRCommands.reset_compiled_object_list_status != LBRStatus.READY) {
      vscode.window.showErrorMessage('LBR process is already running');
      return;
    }

    LBRCommands.reset_compiled_object_list_status = LBRStatus.IN_PROCESS;

    const config = AppConfig.get_app_config();

    try {
      if (!config.general['compiled-object-list'])
        throw Error(`Invalid config for config.general['compiled-object-list']: ${config.general['compiled-object-list']}`);

      const object_list_file: string = config.general['compiled-object-list'];
      let json_dict: {} = {};

      const source_hashes: source.ISource[] = await LBRTools.retrieve_current_source_hashes();

      source_hashes.map((source: source.ISource) => {
        const source_name: string = Object.keys(source)[0];
        json_dict[source_name.replaceAll('\\', '/')] = source[source_name];
      });
      DirTool.write_json(path.join(Workspace.get_workspace(), object_list_file), json_dict);
      vscode.window.showInformationMessage(`Object list created`);

      //await SSH_Tasks.transfer_files([object_list_file]);
      //vscode.window.showInformationMessage(`Object list transfered to IBM i`);
    }
    catch (e: any) {
      vscode.window.showErrorMessage(e.message);
    }

    LBRCommands.reset_compiled_object_list_status = LBRStatus.READY;
    return;
  }



  /**
   * Generates remote source list.
   *
   * It's similar to object list.
   *
   * @returns
   */
  public static async get_remote_source_list(): Promise<void> {

    if (LBRCommands.remote_source_list_status != LBRStatus.READY) {
      vscode.window.showErrorMessage('LBR process is already running');
      return;
    }

    LBRCommands.remote_source_list_status = LBRStatus.IN_PROCESS;

    try {

      const ws = Workspace.get_workspace();
      const config = AppConfig.get_app_config();
      const remote_base_dir: string | undefined = config.general['remote-base-dir'];
      const remote_lbr_dir: string | undefined = config.general['remote-lbr-dir'];

      if (!remote_base_dir || !remote_lbr_dir)
        throw Error(`Missing 'remote_base_dir' or 'remote_lbr_dir'`);

      const remote_lbr: string | undefined = `${config.general['remote-lbr-dir']}/venv/bin/python`;

      await SSH_Tasks.transfer_files([Constants.LBR_APP_CONFIG_FILE, Constants.LBR_APP_CONFIG_USER_FILE]);

      let ssh_cmd: string = `cd '${remote_base_dir}' || exit 1; rm log/* .lbr/log/* 2>/dev/null || true; ${remote_lbr} -X utf8 ${remote_lbr_dir}/main.py -a gen_src_list -p .`;
      await SSH_Tasks.executeCommand(ssh_cmd);

      if (config.general['remote-source-list'] && config.general['source-list'])
        await SSH_Tasks.getRemoteFile(path.join(ws, config.general['remote-source-list']), `${remote_base_dir}/${config.general['source-list']}`);

      vscode.window.showInformationMessage('Remote source list transfered from remote');
    }
    catch (e: any) {
      LBRCommands.remote_source_list_status = LBRStatus.READY;
      vscode.window.showErrorMessage(e.message);
      vscode.window.showErrorMessage('Failed to get remote source list');
      logger.error(e.message, e.stack);
      throw e;
    }
    LBRCommands.remote_source_list_status = LBRStatus.READY;

    return;
  }



  public static async get_remote_compiled_object_list() {

    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const remote_lbr_dir: string | undefined = config.general['remote-lbr-dir'];

    if (!remote_base_dir || !remote_lbr_dir)
      throw Error(`Missing config 'remote-base-dir' or 'remote-lbr-dir'`);

    if (!config.general['compiled-object-list'])
      throw Error(`Missing config 'compiled-object-list'`);

    await SSH_Tasks.getRemoteFile(path.join(Workspace.get_workspace(), config.general['compiled-object-list']), `${remote_base_dir}/${config.general['compiled-object-list']}`);

    vscode.window.showInformationMessage('Compiled object list transfered from remote');

  }

}
