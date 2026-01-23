import * as vscode from 'vscode';
import { DirTool } from './DirTool';
import * as path from 'path';
import { getUri } from './getUri';
import { getNonce } from './getNonce';
import { Constants } from '../Constants';

import { AppConfig, IConfigProperties } from '../webview/controller/AppConfig';
import { SSH_Tasks } from './SSH_Tasks';
import * as source from '../lbt/Source';
import { Workspace } from './Workspace';
import * as fs from 'fs-extra';
import { logger } from './Logger';
import { lbtCommands } from '../lbt/LBTCommands';
import { LocaleText } from './LocaleText';
import { lbtStatus } from '../lbt/LBTStatus';
import { createBuildList } from '../lbt/compile_list/createBuildList';



export class lbtTools {

  public static ext_context?: vscode.ExtensionContext;
  public static lang: LocaleText | undefined = undefined;

  public static check_remote_sources_status: lbtStatus = lbtStatus.READY;
  public static transfer_all_status: lbtStatus = lbtStatus.READY;

  private static _dependency_list: { ['source']: string[] }|undefined = undefined;
  private static _last_loading_time: number = 0;

  private static _threads: {[key: string]: string} = {};




  public static cancel(thread_name: string) {
    lbtTools._threads[thread_name] = 'cancel';
  }


  /**
   * Self check of the extension
   */
  public static self_check() {
    if (!vscode.workspace.workspaceFolders || !lbtTools.ext_context) {
      vscode.window.showErrorMessage('No workspace is opened!');
      return;
    }

    const ws = Workspace.get_workspace();
    const ext_ws = path.join(lbtTools.ext_context.asAbsolutePath('.'), 'lbt-media');
    const current_version: string = vscode.extensions.getExtension('roland-strauss.lbt')?.packageJSON['version'];
    let previous_version: string | undefined = lbtTools.ext_context.workspaceState.get('lbt.version');
    const config: AppConfig = AppConfig.get_app_config();

    if (config.general['local-base-dir'] == '/')
      throw Error("Root for 'local-base-dir' is not allowed!");

    if (config.general['remote-base-dir'] == '/')
      throw Error("Root for 'remote-base-dir' is not allowed!");

    if (config.general['local-lbt-dir'] == '/')
      throw Error("Root for 'local-lbt-dir' is not allowed!");

    if (config.general['remote-lbt-dir'] == '/')
      throw Error("Root for 'remote-lbt-dir' is not allowed!");


    if (!DirTool.dir_exists(path.join(ws, '.lbt', 'log'))) {
      fs.mkdirSync(path.join(ws, '.lbt', 'log'), { recursive: true });
    }
    if (!DirTool.dir_exists(path.join(ws, Constants.SOURCE_FILTER_FOLDER_NAME))) {
      fs.mkdirSync(path.join(ws, Constants.SOURCE_FILTER_FOLDER_NAME), { recursive: true });
    }
    if (!DirTool.dir_exists(path.join(ws, '.lbt', 'tmp'))) {
      fs.mkdirSync(path.join(ws, '.lbt', 'tmp'), { recursive: true });
    }
    if (!DirTool.file_exists(path.join(ws, config.general['source-infos'] || 'source-infos.json'))) {
      DirTool.write_file(path.join(ws, config.general['source-infos'] || 'source-infos.json'), '[]');
    }
    if (!DirTool.file_exists(path.join(ws, config.general['dependency-list'] || 'dependency.json'))) {
      DirTool.write_file(path.join(ws, config.general['dependency-list'] || 'dependency.json'), '');
    }
    if (!DirTool.file_exists(path.join(ws, config.general['compiled-object-list'] || 'object-build.json'))) {
      DirTool.write_file(path.join(ws, config.general['compiled-object-list'] || 'object-build.json'), '');
    }

    if (!DirTool.dir_exists(path.join(ws, Constants.SOURCE_FILTER_FOLDER_NAME))) {
      fs.mkdirSync(path.join(ws, Constants.SOURCE_FILTER_FOLDER_NAME), { recursive: true });
      fs.copyFileSync(path.join(ext_ws, Constants.SOURCE_FILTER_FOLDER_NAME, 'All sources.json'), path.join(ws, Constants.SOURCE_FILTER_FOLDER_NAME, 'All sources.json'));
    }

    if (!DirTool.file_exists(path.join(ws, '.lbt', 'etc', 'logger_config.py'))) {
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'logger_config.py'), path.join(ws, '.lbt', 'etc', 'logger_config.py'));
    }

    if (!DirTool.file_exists(path.join(ws, '.lbt', 'etc', 'constants.py'))) {
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'constants.py'), path.join(ws, '.lbt', 'etc', 'constants.py'));
    }

    AppConfig.self_check();

    let previous_version_int = 0;
    if (previous_version) {
      const match = previous_version.match(/^(\d+)\.(\d+)\.(\d+)$/);
      if (match) {
        // Pad each group to 2 digits
        const major = match[1].padStart(2, '0');
        const minor = match[2].padStart(2, '0');
        const patch = match[3].padStart(2, '0');
        previous_version_int = parseInt(major + minor + patch);
      }
    }

    if (previous_version_int <= 208) {
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'constants.py'), path.join(ws, '.lbt', 'etc', 'constants.py'));
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'logger_config.py'), path.join(ws, '.lbt', 'etc', 'logger_config.py'));
    }
    if (previous_version_int <= 221) {
      let config = AppConfig.get_project_app_config(Workspace.get_workspace_uri());
      config.general['compiled-object-list'] = Constants.COMPILED_OBJECT_LIST;
      config.general['remote-source-list'] = Constants.REMOTE_SOURCE_LIST;
      config.general['source-list'] = Constants.SOURCE_LIST;
      config.general['dependency-list'] = Constants.DEPENDENCY_LIST;
      const toml_file = path.join(Workspace.get_workspace(), Constants.LBT_APP_CONFIG_FILE);
      DirTool.write_toml(toml_file, config);
      AppConfig.reset();
    }
    if (previous_version_int <= 324) {
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'constants.py'), path.join(ws, '.lbt', 'etc', 'constants.py'));
    }
    if (previous_version_int <= 607) {
      fs.copyFileSync(path.join(ext_ws, '.lbt', 'etc', 'constants.py'), path.join(ws, '.lbt', 'etc', 'constants.py'));
    }

    lbtTools.ext_context.workspaceState.update('lbt.version', current_version);

    const content: {['source']: string[]}  = lbtTools.get_dependency_list();
    if (!content || Object.keys(content).length === 0) {
      vscode.window.showWarningMessage('Missing source dependencies');
    }


  }



  public static without_local_lbt(): boolean {
    return lbtTools.get_local_lbt_python_path() == undefined;
  }



  public static get_local_lbt_python_path(): string | undefined {

    const config = AppConfig.get_app_config();

    if (!config.general['local-lbt-dir'])
      return undefined;

    let venv_bin = path.join('venv', 'bin', 'python');
    if (process.platform == 'win32')
      venv_bin = path.join('venv', 'Scripts', 'python.exe');

    const local_lbt_python: string = path.join(config.general['local-lbt-dir'], venv_bin);

    logger.info(`Check lbt path ${local_lbt_python}: ${DirTool.file_exists(local_lbt_python)}`);
    if (!DirTool.file_exists(local_lbt_python))
      return undefined;

    return local_lbt_python;
  }




  public static async get_remote_lbt_python_path(): Promise<string | undefined> {

    const config = AppConfig.get_app_config();

    if (!config.general['remote-lbt-dir'])
      return undefined;

    const remote_lbt_python: string = `${config.general['remote-lbt-dir']}/venv/bin/python`;

    return remote_lbt_python;
  }




  public static async check_remote(): Promise<boolean> {

    if (! await lbtTools.check_remote_basics()) {
      vscode.window.showWarningMessage('Missing lbt project on remote system.');
      try {
        await lbtTools.transfer_project_folder(false);
      }
      catch {
        return false;
      }
    }

    return true;
  }




  public static async check_remote_pase(): Promise<boolean> {

    let check: boolean;

    check = await lbtTools.check_remote_home_dir();
    if (!check)
      return false;

    check = await SSH_Tasks.check_remote_paths(['/home/$USER/.bashrc']);
    if (check)
      return true;

    const answer = await vscode.window.showErrorMessage(`Missing /home/$USER.bashrc. Run setup?`, { modal: true }, ...['Yes', 'No']);
    switch (answer) {
      case 'No':
        return false;
      case undefined: // Canceled
        return false;
      case 'Yes':
        try {
          await SSH_Tasks.executeCommand(`echo 'export PATH="/QOpenSys/pkgs/bin:$PATH"' > /home/$USER/.bashrc`);
        }
        catch (e: any) {
          logger.error(e, e.stack);
          vscode.window.showErrorMessage(`Error creating /home/$USER.bashrc: ${e.message}`);
          return false;
        }
        vscode.window.showInformationMessage(`/home/$USER.bashrc created.`);
        return true;
    }

    return false;

  }




  public static async check_remote_home_dir(): Promise<boolean> {

    let check: boolean;

    check = await SSH_Tasks.check_remote_paths(['/home/$USER']);
    if (check)
      return true;

    const answer = await vscode.window.showErrorMessage(`Missing home directory. Run setup?`, { modal: true }, ...['Yes', 'No']);
    switch (answer) {
      case 'No':
        return false;
      case undefined: // Canceled
        return false;
      case 'Yes':
        try {
          await SSH_Tasks.executeCommand(`mkdir -p /home/$USER/.ssh && chmod 755 /home/$USER && chmod 700 /home/$USER/.ssh && echo 'export PATH="/QOpenSys/pkgs/bin:$PATH"' > /home/$USER/.bashrc`);
        }
        catch (e: any) {
          logger.error(e, e.stack);
          if (!e.message.includes('No such file or directory')) {
            vscode.window.showErrorMessage(`Error creating home directory: ${e.message}`);
            return false;
          }
        }
        vscode.window.showInformationMessage(`Home directory created.`);
        return true;
    }

    return false;
  }



  public static async check_remote_basics(): Promise<boolean> {

    const config = AppConfig.get_app_config();
    const remote_base_dir: string | undefined = config.general['remote-base-dir'];
    const remote_lbt_dir: string | undefined = config.general['remote-lbt-dir'];
    const remote_lbt_python: string = `${config.general['remote-lbt-dir']}/venv/bin/python`;

    let check: boolean;

    if (!remote_base_dir || !remote_lbt_dir)
      throw Error(`Missing 'remote_base_dir' or 'remote_lbt_dir'`);

    if (!config.general['source-dir'])
      return false;

    check = await SSH_Tasks.check_remote_paths([
      `${remote_base_dir}/${config.general['source-dir']}`,
      `${remote_base_dir}/${Constants.LBT_APP_CONFIG_FILE}`,
      remote_lbt_python
    ]);
    if (!check)
      return false;

    return true;

  }



  public static async check_remote_sources(): Promise<boolean> {

    if (lbtTools.check_remote_sources_status != lbtStatus.READY) {
      vscode.window.showErrorMessage('Remote check is already running');
      return false;
    }

    lbtTools.check_remote_sources_status = lbtStatus.IN_PROCESS;
    let result: boolean = false;

    try {
      result = await lbtTools.process_check_remote_sources();
    }
    catch (e: any) {
      logger.error(e, e.stack);
      vscode.window.showErrorMessage('Error occured during remote source check');
    }

    lbtTools.check_remote_sources_status = lbtStatus.READY;

    return result;
  }



  public static async process_check_remote_sources(): Promise<boolean> {

    const config = AppConfig.get_app_config();
    const ws: string = Workspace.get_workspace();

    if (!config.general['remote-source-list'])
      return false;

    const result = await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Remote source check`,
    },
      async progress => {

        progress.report({
          message: `Check remote sources`
        });

        if (!await lbtTools.check_remote()) {
          return false;
        }

        progress.report({
          message: `Get remote source hashes`
        });

        await lbtCommands.get_remote_source_list();
        const remote_source_list: source.ISource = DirTool.get_json(path.join(ws, config.general['remote-source-list']));

        progress.report({
          message: `Get local source hashes`
        });

        const current_hash_list = await lbtTools.retrieve_current_source_hashes();

        progress.report({
          message: `Compare remote vs. local`
        });

        const changed_sources: source.ISourceList = await lbtTools.compare_source_change(current_hash_list, remote_source_list);
        const all_sources: string[] = [...changed_sources['changed-sources'], ...changed_sources['new-objects']];

        if (all_sources.length) {
          const answer = await vscode.window.showErrorMessage(`${all_sources.length} changed sources. Do you want to transfer to remote?\n\n${all_sources.slice(0, 5).join('\n')}`, { modal: true }, ...['Yes', 'No']);
          switch (answer) {
            case 'No':
              return false;
            case undefined: // Canceled
              return false;
            case 'Yes':
              await SSH_Tasks.transferSources(all_sources);
              vscode.window.showInformationMessage(`Sources transfered to ${config.connection['remote-host']}`);
          }
        }

        if (changed_sources['old-sources'] && changed_sources['old-sources'].length) {
          const answer = await vscode.window.showErrorMessage(`${changed_sources['old-sources'].length} not needed sources on remote system.\nDo you want to delete them?\n\n${changed_sources['old-sources'].join('\n')}`, { modal: true }, ...['Yes', 'No']);
          switch (answer) {
            case 'No':
              return false;
            case undefined: // Canceled
              return false;
            case 'Yes':
              await SSH_Tasks.delete_sources(changed_sources['old-sources']);
              vscode.window.showInformationMessage(`Sources transfered to ${config.connection['remote-host']}`);
          }
        }
        vscode.window.showInformationMessage('Remote source check finished');
        return true;
      })

    return result;
  }


  public static contains_lbt_project(): boolean {

    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length == 0) {
      return false;
    }

    const ws = vscode.workspace.workspaceFolders[0].uri.fsPath;

    if (!DirTool.file_exists(path.join(ws, Constants.LBT_APP_CONFIG_FILE)))
      return false;

    //if (!AppConfig.attributes_missing())
    //  return false;

    return true;
  }



  public static async initialize_folder(): Promise<void> {

    if (!vscode.workspace.workspaceFolders || !lbtTools.ext_context) {
      vscode.window.showErrorMessage('No workspace is opened!');
      return;
    }

    const ws = Workspace.get_workspace();
    const template_ws = path.join(lbtTools.ext_context.asAbsolutePath('.'), 'lbt-media');

    let copies: Promise<void>[] = [];

    const tmpDirs = await fs.readdir(template_ws, { withFileTypes: true });
    for (const dirent of tmpDirs) {
      const srcDir = path.join(template_ws, dirent.name);
      const destDir = path.join(ws, dirent.name);
      copies.push(fs.cp(srcDir, destDir, {
        recursive: true,
        force: false,         // don't overwrite existing files
        errorOnExist: false,  // don't throw if file exists
      }));
    }

    Promise.all(copies).then(() => {
      vscode.window.showInformationMessage(`${copies.length} files copied`);
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    })
      .catch((reason: Error) => {
        vscode.window.showErrorMessage(reason.message);
      });

  }



  public static get_global_stuff(webview: vscode.Webview, extensionUri: vscode.Uri) {

    const styleUri = getUri(webview, extensionUri, ["asserts/css", "style.css"]);

    const asserts_uri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'asserts'));
    const nonce = getNonce();

    let theme_mode = 'light';
    if (vscode.window.activeColorTheme.kind == vscode.ColorThemeKind.Dark)
      theme_mode = 'dark';

    const ws: string | undefined = Workspace.get_workspace();

    return {
      asserts_uri: asserts_uri,
      styleUri: styleUri,
      nonce: nonce,
      current_date: new Date().toLocaleString(),
      theme_mode: theme_mode,
      get_text: (v: string) => {
        return LocaleText.localeText?.get_Text(v);
      },
      locale: LocaleText.localeText?.current_locale,
      current_profile: ws ? AppConfig.get_current_profile_app_config_name() : undefined,
      workspace_settings: ws ? Workspace.get_workspace_settings() : undefined
    }
  }




  public static override_dict(from_dict: {}, to_dict: {}): any {
    if (to_dict == undefined)
      to_dict = {};

    for (let [k, v] of Object.entries(from_dict)) {
      if (typeof v === 'object' && v !== null && to_dict[k] && !(v instanceof Array) && !(v instanceof Date))
        v = lbtTools.override_dict(from_dict[k], to_dict[k]);

      if (v == undefined)
        continue;
      if ((typeof v == 'string') && v.length == 0)
        continue;
      if (v instanceof Array && v.length == 0)
        continue;

      to_dict[k] = v;
    }
    //return {...to_dict, ...from_dict};
    return to_dict;
  }


  public static update_compile_list(ignore_sources: string[], ignore_sources_cmd: { [key: string]: [string] | null }): void {
    let compile_list = lbtTools.get_compile_list(Workspace.get_workspace_uri());

    for (const level_item of (compile_list['compiles'] as any)) {
      for (const source of level_item['sources']) {
        source['ignore'] = false;
        if (ignore_sources.includes(source['source'])) {
          source['ignore'] = true;
        }
        for (const cmd of source['cmds']) {
          cmd['ignore'] = false;
          if (ignore_sources_cmd[source['source']] && ignore_sources_cmd[source['source']].includes(cmd['cmd'])) {
            cmd['ignore'] = true;
          }
        }
      }
    }

    DirTool.write_json(path.join(Workspace.get_workspace(), AppConfig.get_app_config().general['compile-list']), compile_list);

  }



  public static get_compile_list(workspaceUri: vscode.Uri): {} | undefined {

    if (AppConfig.attributes_missing())
      return undefined;

    const config = AppConfig.get_app_config();
    if (!config.general['compile-list']) {
      vscode.window.showErrorMessage('lbt config is invalid');
      throw Error('lbt config is invalid');
    }

    const file_path: string = path.join(workspaceUri.fsPath, config.general['compile-list']);

    if (!DirTool.file_exists(file_path))
      return undefined;

    let compile_list_string: string = fs.readFileSync(file_path).toString();
    // Converting to JSON
    const compile_list = JSON.parse(compile_list_string);

    if (typeof compile_list != 'object' || compile_list == null || (compile_list instanceof Array) || (compile_list instanceof Date))
      return undefined;

    if (!compile_list['compiles'] || !compile_list['timestamp'])
      return undefined;

    return compile_list
  }




  public static get_sources_info_from_compile_list(): source.SourceCompileList[] {

    let sources: source.SourceCompileList[] = [];

    const compile_list: {} | undefined = lbtTools.get_compile_list(Workspace.get_workspace_uri());

    if (!compile_list || !('compiles' in compile_list))
      return sources;

    for (const level_item of (compile_list['compiles'] as any)) {
      for (const source of level_item['sources']) {
        sources.push(source);
      }
    }

    return sources;
  }



  public static get_sources_2_build_from_compile_list(skip_ignored: boolean=false): string[] {

    let sources: string[] = [];
    let need_2_build: boolean = false;

    const compile_list: {} | undefined = lbtTools.get_compile_list(Workspace.get_workspace_uri());

    if (!compile_list || !('compiles' in compile_list))
      return sources;

    for (const level_item of (compile_list['compiles'] as any)) {

      for (const source of level_item['sources']) {

        if (skip_ignored && source['ignore'])
          continue;

        need_2_build = false;
        for (const cmd of source['cmds']) {
          if (cmd['status'] != 'success') {
            need_2_build = true;
            break;
          }
        }
        if (need_2_build)
          sources.push(source['source']);
      }
    }

    return sources;
  }




  public static is_compile_list_completed(workspaceUri: vscode.Uri): boolean {

    const compile_list: {} | undefined = lbtTools.get_compile_list(workspaceUri);

    if (!compile_list || !('compiles' in compile_list))
      return false;

    for (const level_item of (compile_list['compiles'] as any)) {
      for (const source of level_item['sources']) {
        for (const cmd of source['cmds']) {
          if (cmd['status'] != 'success')
            return false;
        }
      }
    }

    return true;
  }




  public static get_source_hash_list(workspace: string): source.ISource | undefined {

    const config = AppConfig.get_app_config();
    if (!config.general['compiled-object-list'])
      return undefined

    const file: string = path.join(workspace, config.general['compiled-object-list'])

    return DirTool.get_json(file)

  }



  public static async get_changed_sources(): Promise<source.ISourceList> { // results: source.Source[]

    const t0 = performance.now();
    const current_hash_list = await lbtTools.retrieve_current_source_hashes();
    const t1 = performance.now();
    logger.info(`1. It took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);

    const t2 = performance.now();
    const changed_sources: source.ISourceList = await lbtTools.compare_source_change(current_hash_list);
    const t3 = performance.now();
    logger.info(`2. It took ${((t3 - t2) / 1000).toFixed(2)} seconds.`);

    return changed_sources;
  }



  public static get_dependency_list(): { ['source']: string[] } {

    if (this._dependency_list && this._last_loading_time > (Date.now() - 10000)) { // Reuse if only 2 seconds old
      return this._dependency_list;
    }

    const config = AppConfig.get_app_config();
    this._dependency_list = DirTool.get_json(path.join(Workspace.get_workspace(), config.general['dependency-list'])) || {};
    this._last_loading_time = Date.now();
    return this._dependency_list;

  }



  public static save_dependency_list(dependency_list: { ['source']: string[] }): void {

    const config = AppConfig.get_app_config();
    DirTool.write_json(path.join(Workspace.get_workspace(), config.general['dependency-list']), dependency_list);
  }



  public static get_dependend_sources(changed_sources: source.ISourceList): string[] {

    let dependend_sources: string[] = [];
    const config = AppConfig.get_app_config();

    const all_sources: string[] = Object.assign([], changed_sources['changed-sources'], changed_sources['new-objects']);

    const dependency_list: { ['source']: string[] } = lbtTools.get_dependency_list();
    for (const [k, v] of Object.entries(dependency_list)) {
      for (let i = 0; i < all_sources.length; i++) {
        if (v.includes(all_sources[i]) && !all_sources.includes(k) && !dependend_sources.includes(k)) {
          dependend_sources.push(k);
          lbtTools.add_all_dependend_sources(dependend_sources, k);
        }
      }
    }

    return dependend_sources;
  }



  public static add_all_dependend_sources(dependend_sources: string[], source: string): string[] {

    const dependency_list: { ['source']: string[] } = lbtTools.get_dependency_list();

    for (const [k, v] of Object.entries(dependency_list)) {
      if (v.includes(source) && source !== k && !dependend_sources.includes(k)) {
        dependend_sources.push(k);
        lbtTools.add_all_dependend_sources(dependend_sources, k);
      }
    }
    return dependend_sources;
  }



  public static async generate_source_change_lists(source?: string): Promise<string[]> {
    const ws = Workspace.get_workspace();

    DirTool.clean_dir(path.join(ws, '.lbt', 'tmp'));
    DirTool.clean_dir(path.join(ws, '.lbt', 'build-output'));

    logger.info('Get changed sources');
    let changed_sources: source.ISourceList = {
      "new-objects": [],
      "changed-sources": [source || ''],
      "old-sources": []
    }
    if (!source)
      changed_sources = await lbtTools.get_changed_sources();

    logger.info('Get dependend sources');
    const dependend_sources: string[] = lbtTools.get_dependend_sources(changed_sources);

    createBuildList(source);

    logger.info('Clean dir');
    DirTool.clean_dir(path.join(Workspace.get_workspace(), '.lbt', 'tmp'));
    DirTool.write_file(path.join(Workspace.get_workspace(), Constants.CHANGED_OBJECT_LIST), JSON.stringify(changed_sources, undefined, 2));
    DirTool.write_file(path.join(Workspace.get_workspace(), Constants.DEPENDEND_OBJECT_LIST), JSON.stringify(dependend_sources, undefined, 2));

    //return changed_sources;
    return [...changed_sources['changed-sources'], ...changed_sources['new-objects'], ...dependend_sources];
  }



  public static async compare_source_change(results: source.ISource[], last_source_hashes?: source.ISource | undefined): Promise<source.ISourceList> {

    // Get all sources which are new or have changed
    if (!last_source_hashes)
      last_source_hashes = lbtTools.get_source_hash_list(Workspace.get_workspace()) || {};

    let changed_sources: string[] = [];
    let new_sources: string[] = [];
    let old_sources: string[] = [];

    logger.info(`Check ${results.length} sources`);

    //----------------------------------------
    // First start all processes
    //----------------------------------------

    const t6 = performance.now();
    let promise_list: Promise<source.ISourceList>[] = [];

    // check for changed sources
    results.map((source_item: source.ISource) => {
      promise_list.push(lbtTools.check_source_change_item(source_item, last_source_hashes));
    });
    const t7 = performance.now();
    logger.info(`Start check_source_change_item: It took ${((t7 - t6) / 1000).toFixed(2)} seconds.`);

    //----
    /*
        let promise_list2: Promise<string|undefined>[] = [];

        // Check for old sources
        const t4 = performance.now();

        for (const k in last_source_hashes) {
          promise_list2.push(lbtTools.check_old_source_item(k, results));
        };

        const t5 = performance.now();
        logger.info(`Start check_old_source_item: It took ${t5 - t4} milliseconds.`);
      */

    //----------------------------------------
    // Then get the results
    //----------------------------------------
    const t0 = performance.now();
    const all_promises = await Promise.all(promise_list);
    const t1 = performance.now();
    logger.info(`Change check: It took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);

    all_promises.map((source_item_list: source.ISourceList) => {
      if (source_item_list['changed-sources'].length > 0)
        changed_sources.push(source_item_list['changed-sources'][0]);
      if (source_item_list['new-objects'].length > 0)
        new_sources.push(source_item_list['new-objects'][0]);
    });

    //----
    /*
        const t2 = performance.now();
        const all_promises2 = await Promise.all(promise_list2);
        const t3 = performance.now();
        logger.info(`Old check: It took ${t3 - t2} milliseconds.`);

        all_promises2.map((source_item: string|undefined) => {
          if (source_item)
            old_sources.push(source_item);
        });
    */

    logger.info(`new_sources: ${new_sources.length}, changed-sources: ${changed_sources.length}`);

    return {
      "new-objects": new_sources,
      "changed-sources": changed_sources,
      "old-sources": old_sources
    };
  }



  private static async check_old_source_item(source_from_list: string, current_sources: source.ISource[]): Promise<string | undefined> {

    let found = false;
    current_sources.map((source_item: source.ISource) => {
      if (source_item[source_from_list]) {
        found = true;
        return;
      }
    });

    if (found)
      return source_from_list;

    return undefined;
  }



  private static async check_source_change_item(source_item: source.ISource, last_source_hashes: source.ISource): Promise<source.ISourceList> {

    const source_name: string = Object.keys(source_item)[0];
    const k_source: string = source_name.replaceAll('\\', '/');
    const v_hash: string = source_item[source_name];
    let source_changed = true;

    if (!(k_source in last_source_hashes)) {
      return { "changed-sources": [], "new-objects": [k_source] };
    }

    if (k_source in last_source_hashes) {

      if (last_source_hashes[k_source] == v_hash) {
        source_changed = false;
        return { "changed-sources": [], "new-objects": [] };
      }
    }

    if (source_changed)
      return { "changed-sources": [k_source], "new-objects": [] };

    return { "changed-sources": [], "new-objects": [] };

  }




  public static async retrieve_current_source_hashes(): Promise<source.ISource[]> {

    logger.info('Start retrieve_current_source_hashes');
    delete lbtTools._threads['retrieve_current_source_hashes'];
    let p1 = performance.now();

    const config = AppConfig.get_app_config();
    const max_threads = config.general['max-threads'] || 20;
    const source_dir = path.join(Workspace.get_workspace(), config.general['source-dir'] || 'src');

    const sources = await DirTool.get_all_files_in_dir2(
      source_dir,
      '.',
      config.general['supported-object-types'] || ['pgm', 'file', 'srvpgm']
    );

    let p2 = performance.now();
    logger.info(`Duration: ${((p2 - p1) / 1000).toFixed(2)} seconds`);

    logger.info(`Get checksum of sources`);

    let checksum_calls = [];
    let counter = 0;
    let hash_values: source.ISource[] = [];

    p1 = performance.now();
    if (sources) {

      //lbtTools.parallel(sources, )
      //... eher mit dowhile und Promise.all und immer dazuhängen ...
      for (const source of sources) {

        if (lbtTools._threads['retrieve_current_source_hashes'] == 'cancel') {
          delete lbtTools._threads['retrieve_current_source_hashes'];
          throw Error('Operation canceled by user');
        }
        counter++;
        checksum_calls.push(DirTool.checksumFile(source_dir, source));
        if (counter > max_threads) {
          const all_promises = await Promise.all(checksum_calls);
          if (all_promises)
            hash_values = [...hash_values, ...all_promises];
          counter = 0;
          checksum_calls = [];
        }
      }

      const all_promises = await Promise.all(checksum_calls);
      if (all_promises)
        hash_values = [...hash_values, ...all_promises];
    }

    p2 = performance.now();
    logger.info(`In total ${hash_values.length} hash values. Duration: ${((p2 - p1) / 1000).toFixed(2)} seconds`);
    return hash_values;
  }




  public static async parallel(arr: [], fn: Function, threads: number = 10) {
    const result = [];
    while (arr.length) {
      const res = await Promise.all(arr.splice(0, threads).map(x => fn(x)));
      result.push(res);
    }
    return result.flat();
  }



  public static get_remote_compiled_object_list() {

    const config = AppConfig.get_app_config();

    if (!config.general['remote-base-dir'])
      throw Error(`Config attribute 'config.general.remote_base_dir' missing`);

    const local_file: string = path.join(Workspace.get_workspace(), config.general['compiled-object-list']);
    const remote_file: string = `${config.general['remote-base-dir']}/${config.general['compiled-object-list']}`;

    SSH_Tasks.getRemoteFile(local_file, remote_file);
  }



  public static async transfer_project_folder(silent: boolean | undefined) {

    if (lbtTools.transfer_all_status != lbtStatus.READY) {
      vscode.window.showErrorMessage('Transfer is already running');
      return;
    }

    lbtTools.transfer_all_status = lbtStatus.IN_PROCESS;
    let result: boolean = false;

    try {
      await lbtTools.process_transfer_project_folder(silent);
    }
    catch (e: any) {
      logger.error(e, e.stack);
      vscode.window.showErrorMessage('Error occured during transfer to remote');
    }

    lbtTools.transfer_all_status = lbtStatus.READY;

    return;
  }



  public static async process_transfer_project_folder(silent: boolean | undefined) {

    const config = AppConfig.get_app_config();

    if (!config.general['remote-base-dir'])
      throw Error(`Config attribute 'config.general.remote_base_dir' missing`);

    const local_dir: string = Workspace.get_workspace();
    const remote_dir: string = config.general['remote-base-dir'];

    if (!silent) {
      const answer = await vscode.window.showErrorMessage(`Do you want to transfer all?\nThis can take several minutes.\n\nRemote folder: ${remote_dir}`, { modal: true }, ...['Only minimum', 'Yes', 'No']);

      switch (answer) {

        case 'No':
          vscode.window.showErrorMessage('Transfer canceled by user');
          throw new Error('Transfer canceled by user');

        case undefined:
          vscode.window.showErrorMessage('Transfer canceled by user');
          throw new Error('Transfer canceled by user');

        case 'Only minimum':
          //Transfer minimum setup;
          await lbtTools.transfer_minimum_now(local_dir, remote_dir);
          break;

        case 'Yes':
          await lbtTools.transfer_all_now(local_dir, remote_dir);
          break;
      }
    }

  }




  private static async transfer_all_now(local_dir: string, remote_dir: string) {
    vscode.window.showInformationMessage('Start transfer');

    const result = await SSH_Tasks.cleanup_directory();
    if (!result) {
      vscode.window.showErrorMessage('Cleanup of remote directory failed!');
      throw Error('Cleanup of remote directory failed!');
      return;
    }

    logger.info(`Transer local dir ${local_dir} to ${remote_dir}`);
    await SSH_Tasks.transfer_dir(local_dir, remote_dir);
  }



  private static async transfer_minimum_now(local_dir: string, remote_dir: string) {
    vscode.window.showInformationMessage('Start transfer');

    const result = await SSH_Tasks.cleanup_directory();
    if (!result) {
      vscode.window.showErrorMessage('Cleanup of remote directory failed!');
      throw Error('Cleanup of remote directory failed!');
      return;
    }

    logger.info(`Transer local dir ${local_dir}/.lbt to ${remote_dir}/.lbt`);
    await SSH_Tasks.transfer_dir(`${local_dir}/.lbt/etc`, `${remote_dir}/.lbt/etc`);
    await SSH_Tasks.transfer_dir(`${local_dir}/${Constants.BUILD_OUTPUT_DIR}`, `${remote_dir}/${Constants.BUILD_OUTPUT_DIR}`);
  }



  public static async get_filtered_sources_with_details(source_list_file: string): Promise<source.IQualifiedSource[] | undefined> {

    const sources = await lbtTools.get_local_sources(false);

    const source_filters: source.IQualifiedSource[] = DirTool.get_json(path.join(Workspace.get_workspace(), Constants.SOURCE_FILTER_FOLDER_NAME, source_list_file)) || [];

    const filtered_sources = lbtTools.get_filtered_sources(sources, source_filters);
    const filtered_sources_extended = lbtTools.get_extended_source_infos(filtered_sources);

    return filtered_sources_extended;
  }



  public static async get_local_sources(filter_supported_types: boolean = true): Promise<source.IQualifiedSource[] | undefined> {

    const config = AppConfig.get_app_config();
    const source_dir = path.join(Workspace.get_workspace(), config.general['source-dir'] || 'src');
    const supported_types = filter_supported_types ? (config.general['supported-object-types'] || ['pgm', 'file', 'srvpgm']) : undefined;

    const sources = await DirTool.get_all_files_in_dir3(
      source_dir,
      '.',
      supported_types
    );

    return sources;
  }



  public static get_source_infos(): source.ISourceInfos {

    const config: AppConfig = AppConfig.get_app_config();

    const source_infos: source.ISourceInfos = DirTool.get_json(path.join(Workspace.get_workspace(), config.general['source-infos'] || '.lbt/etc/source-infos.json')) || [];

    return source_infos;
  }


  public static update_source_infos(source_path: String, source_member: String, description: String): void {

    const config: AppConfig = AppConfig.get_app_config();

    const source_infos: source.ISourceInfos = lbtTools.get_source_infos();

    const full_name: string = `${source_path}/${source_member}`;
    logger.info(`Update source info for ${full_name}`);

    if (!(full_name in source_infos)) {
      source_infos[full_name] = { 'description': '' };
    }

    source_infos[full_name]['description'] = description;

    DirTool.write_file(path.join(Workspace.get_workspace(), config.general['source-infos'] || '.lbt/etc/source-infos.json'), JSON.stringify(source_infos, undefined, 2));

    return;
  }



  public static get_extended_source_infos(sources: source.IQualifiedSource[] | undefined): source.IQualifiedSource[] | undefined {

    if (!sources)
      return;

    let new_list: source.IQualifiedSource[] = [];

    const config: AppConfig = AppConfig.get_app_config();
    const source_infos: source.ISourceInfos = lbtTools.get_source_infos();

    for (let source of sources) {

      source.description = '';

      const full_name: string = `${source['source-lib']}/${source['source-file']}/${source['source-member']}`;
      if (full_name in source_infos) {
        source.description = source_infos[full_name].description;
      }
      new_list.push(source);
    }

    return new_list;
  }




  private static get_filtered_sources(sources: source.IQualifiedSource[] | undefined, source_filters: source.IQualifiedSource[]): source.IQualifiedSource[] | undefined {

    if (!sources)
      return;

    const wcmatch = require('wildcard-match');
    let filtered_sources: source.IQualifiedSource[] = [];
    let use_regex: boolean;
    let show_empty_folders: boolean;
    let lib: string;
    let file: string;
    let mbr: string;
    let isMatch: boolean = false;

    for (let source of sources) {

      const src_mbr = source['source-member'];
      const src_file = source['source-file'];
      const src_lib = source['source-lib'];


      for (const source_filter of source_filters) {

        show_empty_folders = source_filter['show-empty-folders'];
        use_regex = source_filter['use-regex'];
        lib = (source_filter['source-lib'] || '').toLowerCase();
        file = (source_filter['source-file'] || '').toLowerCase();
        mbr = (source_filter['source-member'] || '').toLowerCase();
        isMatch = false;

        if ((!src_lib || !src_file || !src_mbr) && !show_empty_folders)
          continue;

        if (!src_lib && !src_file)
          continue;

        if (use_regex) {
          const re_lib = new RegExp(`^${lib}$`);
          const re_file = new RegExp(`^${file}$`);
          const re_mbr = new RegExp(`^${mbr}$`);
          isMatch = (src_lib.toLowerCase().match(re_lib) != null && src_file.toLowerCase().match(re_file) != null && src_mbr.toLowerCase().match(re_mbr) != null);
        }
        else {
          const wc_lib = wcmatch(lib);
          const wc_file = wcmatch(file);
          const wc_mbr = wcmatch(mbr);
          isMatch = wc_lib(src_lib.toLowerCase()) && wc_file(src_file.toLowerCase()) && wc_mbr(src_mbr.toLowerCase());
        }
        if (isMatch)
          filtered_sources.push({ "source-lib": src_lib, "source-file": src_file, "source-member": src_mbr, "use-regex": false, "show-empty-folders": false});
      }
    }

    return filtered_sources;
  }


  public static convert_local_filepath_2_lbt_filepath(local_file_path: string, remove_src?: boolean): string {

    const config = AppConfig.get_app_config();
    const src_dir: string = config.general['source-dir'] || 'src';

    local_file_path = local_file_path.replace(Workspace.get_workspace(), '')
    local_file_path = local_file_path.replace(/\\/g, '/');
    if (remove_src)
      local_file_path = local_file_path.replace(`${src_dir}/`, '');
    local_file_path = local_file_path.replace(/^\/+/, '');

    return local_file_path;
  }



  public static async reload_lbt_extension_on_config_change() {

    const ws_uri = Workspace.get_workspace_uri();

    // Create a file system watcher
    const watcher_project = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(ws_uri, Constants.LBT_APP_CONFIG_FILE));
    const watcher_user = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(ws_uri, AppConfig.get_current_profile_app_config_file()));

    // File change events
    watcher_project.onDidChange(uri => {
      vscode.window.showInformationMessage(`Project config file changed: ${uri.fsPath}`);
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    });
    watcher_user.onDidChange(uri => {
      vscode.window.showInformationMessage(`User config file changed: ${uri.fsPath}`);
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    });

  }

}
