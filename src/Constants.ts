import * as path from 'path';

export class Constants {

  public static readonly HTML_TEMPLATE_DIR: string = path.join(__dirname, '..', 'asserts', 'templates');
  public static readonly LBR_DIR: string = ".lbr";
  public static readonly LBR_CONFIGS_DIR: string = ".lbr/etc";
  public static readonly LBR_APP_CONFIG_DIR: string = `${Constants.LBR_CONFIGS_DIR}`;
  public static readonly SOURCE_FILTER_FOLDER_NAME: string = '.lbr/source-list';
  public static readonly BUILD_OUTPUT_DIR: string = ".lbr/build-output";
  public static readonly BUILD_HISTORY_DIR: string = ".lbr/build-history";
  public static readonly LBR_STATUS_FILE: string = `${Constants.BUILD_OUTPUT_DIR}/status.json`;
  public static readonly LBR_WORKSPACE_SETTINGS_FILE: string = `${Constants.LBR_CONFIGS_DIR}/workspace-settings.json`;
  public static readonly LBR_BACKEND_VERSION: number = 3;
  public static readonly LBR_APP_CONFIG: string = 'app-config.toml';
  public static readonly LBR_APP_CONFIG_FILE: string = `${Constants.LBR_APP_CONFIG_DIR}/${Constants.LBR_APP_CONFIG}`;
  public static readonly LBR_APP_CONFIG_USER: string = '.user-app-config.toml';
  public static readonly LBR_APP_CONFIG_USER_FILE: string = `${Constants.LBR_APP_CONFIG_DIR}/${Constants.LBR_APP_CONFIG_USER}`;
  public static readonly LBR_SOURCE_CONFIG_FILE: string = ".lbr/etc/source-config.toml";
  public static readonly LBR_TMP_DIR: string = ".lbr/tmp";
  public static readonly LBR_LOG_FILE: string = ".lbr/log/main.log";
  public static readonly DEPENDEND_OBJECT_LIST: string = ".lbr/tmp/dependend-object-list.json";
  public static readonly CHANGED_OBJECT_LIST: string = ".lbr/tmp/changed-object-list.json";
  public static readonly REMOTE_LBR_PYTHON_PATH: string = "venv/bin/python";
  public static readonly DEPLOYMENT_CONFIG_FILE: string = ".lbr/etc/deployment.toml";

  public static readonly DEPENDENCY_LIST: string = ".lbr/etc/dependency.json";
  public static readonly SOURCE_LIST: string = ".lbr/etc/source-list.json";
  public static readonly REMOTE_SOURCE_LIST: string = '.lbr/etc/source-list-remote.json';
  public static readonly COMPILED_OBJECT_LIST: string = '.lbr/etc/object-builds.json';

}
