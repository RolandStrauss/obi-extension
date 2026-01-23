import * as path from 'path';

export class Constants {

  public static readonly HTML_TEMPLATE_DIR: string = path.join(__dirname, '..', 'asserts', 'templates');
  public static readonly LBT_DIR: string = ".lbt";
  public static readonly LBT_CONFIGS_DIR: string = ".lbt/etc";
  public static readonly LBT_APP_CONFIG_DIR: string = `${Constants.LBT_CONFIGS_DIR}`;
  public static readonly SOURCE_FILTER_FOLDER_NAME: string = '.lbt/source-list';
  public static readonly BUILD_OUTPUT_DIR: string = ".lbt/build-output";
  public static readonly BUILD_HISTORY_DIR: string = ".lbt/build-history";
  public static readonly LBT_STATUS_FILE: string = `${Constants.BUILD_OUTPUT_DIR}/status.json`;
  public static readonly LBT_WORKSPACE_SETTINGS_FILE: string = `${Constants.LBT_CONFIGS_DIR}/workspace-settings.json`;
  public static readonly LBT_BACKEND_VERSION: number = 3;
  public static readonly LBT_APP_CONFIG: string = 'app-config.toml';
  public static readonly LBT_APP_CONFIG_FILE: string = `${Constants.LBT_APP_CONFIG_DIR}/${Constants.LBT_APP_CONFIG}`;
  public static readonly LBT_APP_CONFIG_USER: string = '.user-app-config.toml';
  public static readonly LBT_APP_CONFIG_USER_FILE: string = `${Constants.LBT_APP_CONFIG_DIR}/${Constants.LBT_APP_CONFIG_USER}`;
  public static readonly LBT_SOURCE_CONFIG_FILE: string = ".lbt/etc/source-config.toml";
  public static readonly LBT_TMP_DIR: string = ".lbt/tmp";
  public static readonly LBT_LOG_FILE: string = ".lbt/log/main.log";
  public static readonly DEPENDEND_OBJECT_LIST: string = ".lbt/tmp/dependend-object-list.json";
  public static readonly CHANGED_OBJECT_LIST: string = ".lbt/tmp/changed-object-list.json";
  public static readonly REMOTE_LBT_PYTHON_PATH: string = "venv/bin/python";
  public static readonly DEPLOYMENT_CONFIG_FILE: string = ".lbt/etc/deployment.toml";

  public static readonly DEPENDENCY_LIST: string = ".lbt/etc/dependency.json";
  public static readonly SOURCE_LIST: string = ".lbt/etc/source-list.json";
  public static readonly REMOTE_SOURCE_LIST: string = '.lbt/etc/source-list-remote.json';
  public static readonly COMPILED_OBJECT_LIST: string = '.lbt/etc/object-builds.json';

}
