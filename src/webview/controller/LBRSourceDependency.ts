import * as vscode from 'vscode';
import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../../utilities/getUri";
import { DirTool } from '../../utilities/DirTool';
import * as path from 'path';
import { Constants } from '../../Constants';
import { LBRTools } from '../../utilities/LBRTools';
import { AppConfig, ConfigCompileSettings, SourceConfig, SourceConfigList } from './AppConfig';
import { Workspace } from '../../utilities/Workspace';
import { LocalSourceList } from '../../utilities/LocalSourceList';

/*
https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
https://mozilla.github.io/nunjucks/api.html
https://www.11ty.dev/docs/languages/nunjucks/
*/
const nunjucks = require('nunjucks');
// configure() returns an Environment
const env = nunjucks.configure(Constants.HTML_TEMPLATE_DIR);

// Register "typename" filter on the environment
env.addFilter("typename", (obj: any) => {
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";

  // If it's a class instance or built-in
  if (obj.constructor && obj.constructor.name) {
    return obj.constructor.name;
  }

  // Fallback
  return typeof obj;
});



export class LBRSourceDependency {

  public static currentPanel: LBRSourceDependency | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private static _context: vscode.ExtensionContext;
  private static _extensionUri: Uri;
  public static source: string;



  /**
   * The ComponentGalleryPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    LocalSourceList.load_source_list();

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

  }


  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static async render(context: vscode.ExtensionContext, extensionUri: Uri, source_config: string) {

    LBRSourceDependency._context = context;
    LBRSourceDependency._extensionUri = extensionUri;
    LBRSourceDependency.source = source_config;

    if (LBRSourceDependency.currentPanel) {
      LBRSourceDependency.currentPanel.dispose();
    }


    // If a webview panel does not already exist create and show a new one
    const panel = this.createNewPanel(extensionUri);

    panel.webview.html = await LBRSourceDependency.generate_html(extensionUri, panel.webview);

    panel.webview.onDidReceiveMessage(this.onReceiveMessage);

    LBRSourceDependency.currentPanel = new LBRSourceDependency(panel, extensionUri);

  }





  private static async generate_html(extensionUri: Uri, webview: Webview): Promise<string> {

    const source_configs: SourceConfigList|undefined = AppConfig.get_source_configs();
    const config: AppConfig = AppConfig.get_app_config();
    const source_dir = path.join(Workspace.get_workspace(), config.general['source-dir'] || 'src');

    let source_config: SourceConfig|undefined;

    if (source_configs)
      source_config = source_configs[LBRSourceDependency.source];

    const local_source_list: string[] = await LocalSourceList.get_source_list();
    const dependencies: Record<string, string[]> = LBRTools.get_dependency_list() || {};
    let dependencies_1: string[] = [];
    let dependencies_2: string[] = [];

    for (const dep of dependencies[LBRSourceDependency.source] || []) {
      dependencies_1.push({"source": dep, "file": DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', dep))} as any);
    }

    for (const [source, deps] of Object.entries(dependencies)) {
      if (deps.includes(LBRSourceDependency.source)) {
        dependencies_2.push({"source": source, "file": DirTool.get_encoded_file_URI(path.join(config.general['source-dir'] || 'src', source))} as any);
      }
    }

    const html = env.render('source_list/maintain-source-dependency.html',
      {
        global_stuff: LBRTools.get_global_stuff(webview, extensionUri),
        config_css: getUri(webview, extensionUri, ["assets/css", "config.css"]),
        main_java_script: getUri(webview, extensionUri, ["out", "source_dependency.js"]),
        icons: {debug_start: '$(preview)'},
        src_folder: DirTool.get_encoded_file_URI(source_dir),
        source: LBRSourceDependency.source,
        source_list: local_source_list,
        dependency_list_1: dependencies_1,
        dependency_list_2: dependencies_2,
        source_file: DirTool.get_encoded_file_URI(path.join(config.general['source-dir']||'src', LBRSourceDependency.source)),
        source_config_file: DirTool.get_encoded_file_URI(Constants.LBR_SOURCE_CONFIG_FILE),
        source_config: source_config
      }
    );

    return html;
  }




  public static async update(): Promise<void> {

    const panel = LBRSourceDependency.currentPanel;

    if (!panel)
      return;

    panel._panel.webview.html = await LBRSourceDependency.generate_html(LBRSourceDependency._extensionUri, LBRSourceDependency.currentPanel?._panel.webview);

  }



  private static onReceiveMessage(message: any): void {

    const workspaceUri =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri
    : undefined;

    if (!workspaceUri)
      return;

    const command = message.command;

    switch (command) {

      case "add_dependency_1":
        LBRSourceDependency.add_dependency(1, message.source);
        break;

      case "add_dependency_2":
        LBRSourceDependency.add_dependency(2, message.source);
        break;

      case "delete_dependency_1":
        LBRSourceDependency.delete_dependency(1, message.source);
        break;

      case "delete_dependency_2":
        LBRSourceDependency.delete_dependency(2, message.source);
        break;

      case "reload":
        LBRSourceDependency.update();
        break;
    }
    return;
  }



  private static add_dependency(type: number, new_source: string): void {

    let dependency_list: Record<string, string[]> = LBRTools.get_dependency_list();

    // Add dependency to current source
    if (type == 1) {
      if (!dependency_list[LBRSourceDependency.source])
        dependency_list[LBRSourceDependency.source] = [];
      dependency_list[LBRSourceDependency.source].push(new_source);
    }

    // Add current source as dependency to other source
    if (type == 2) {
      if (!dependency_list[new_source])
        dependency_list[new_source] = [];
      dependency_list[new_source].push(LBRSourceDependency.source);
    }

    LBRTools.save_dependency_list(dependency_list);
  }



  private static delete_dependency(type: number, source: string): void {
    let dependency_list: Record<string, string[]> = LBRTools.get_dependency_list();

    let key: string;
    let value: string;

    if (type == 1) {
      key = LBRSourceDependency.source;
      value = source;
    }

    if (type == 2) {
      key = source;
      value = LBRSourceDependency.source;
    }

    if (dependency_list[key]) {
      const i = dependency_list[key].indexOf(value);
      if (i > -1) {
        dependency_list[key].splice(i, 1);
      }
    }

    LBRTools.save_dependency_list(dependency_list);
  }



  private static createNewPanel(extensionUri : Uri) {
    return window.createWebviewPanel(
      'lbr_source_dependency', // Identifies the type of the webview. Used internally
      'LBR source dependency', // Title of the panel displayed to the user
      // The editor column the panel should be displayed in
      ViewColumn.One,
      // Extra panel configurations
      {
        // Enable JavaScript in the webview
        enableScripts: true,
        enableCommandUris: true,
        enableFindWidget: true,
        // Restrict the webview to only load resources from the `out` directory
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "out"),
          vscode.Uri.joinPath(extensionUri, "asserts")
        ],
        retainContextWhenHidden: true
      }
    );
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    LBRSourceDependency.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

}
