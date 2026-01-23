import * as vscode from 'vscode';
import { DirTool } from './DirTool';
import path from 'path';
import { Constants } from '../Constants';
import { logger } from './Logger';


export class WorkspaceSettings {
  current_profile?: string;

}


export class Workspace {

  public static update_workspace_settings(settings: WorkspaceSettings) {
    DirTool.write_json(path.join(Workspace.get_workspace_internal(), Constants.LBT_WORKSPACE_SETTINGS_FILE), settings);
  }

  public static get_workspace_settings(): WorkspaceSettings {

    const result: WorkspaceSettings = DirTool.get_json(path.join(Workspace.get_workspace_internal(), Constants.LBT_WORKSPACE_SETTINGS_FILE)) ?? {};
    return result;
  }

  public static get_workspace_uri(): vscode.Uri {

    if (!vscode.workspace.workspaceFolders)
      {throw new Error('No workspace available');}

    return vscode.workspace.workspaceFolders[0].uri;
  }

  /**
   * Internal method that throws if workspace is not available.
   * Use this when a workspace MUST be available.
   */
  private static get_workspace_internal(): string {
    if (!vscode.workspace.workspaceFolders) {
      const err = 'No workspace available';
      logger.error(err);
      throw new Error(err);
    }

    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  /**
   * Public method that returns workspace path or undefined.
   * Check for undefined before using in path operations.
   */
  public static get_workspace(): string | undefined {

    if (!vscode.workspace.workspaceFolders) {
      logger.error('No workspace available');
      return undefined;
    }

    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

}
