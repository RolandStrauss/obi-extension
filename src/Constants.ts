import * as path from 'path';

export class Constants {

  public static readonly HTML_TEMPLATE_DIR: string = path.join(__dirname, '..', 'asserts', 'templates');
  public static readonly ldm_DIR: string = ".ldm";
  public static readonly ldm_CONFIGS_DIR: string = ".ldm/etc";
  public static readonly ldm_APP_CONFIG_DIR: string = `${Constants.ldm_CONFIGS_DIR}`;
  public static readonly SOURCE_FILTER_FOLDER_NAME: string = '.ldm/source-list';
  public static readonly BUILD_OUTPUT_DIR: string = ".ldm/build-output";
  public static readonly BUILD_HISTORY_DIR: string = ".ldm/build-history";
  public static readonly ldm_STATUS_FILE: string = `${Constants.BUILD_OUTPUT_DIR}/status.json`;
  public static readonly ldm_WORKSPACE_SETTINGS_FILE: string = `${Constants.ldm_CONFIGS_DIR}/workspace-settings.json`;
  public static readonly ldm_BACKEND_VERSION: number = 3;
  public static readonly ldm_APP_CONFIG: string = 'app-config.toml';
  public static readonly ldm_APP_CONFIG_FILE: string = `${Constants.ldm_APP_CONFIG_DIR}/${Constants.ldm_APP_CONFIG}`;
  public static readonly ldm_APP_CONFIG_USER: string = '.user-app-config.toml';
  public static readonly ldm_APP_CONFIG_USER_FILE: string = `${Constants.ldm_APP_CONFIG_DIR}/${Constants.ldm_APP_CONFIG_USER}`;
  public static readonly ldm_SOURCE_CONFIG_FILE: string = ".ldm/etc/source-config.toml";
  public static readonly ldm_TMP_DIR: string = ".ldm/tmp";
  public static readonly ldm_LOG_FILE: string = ".ldm/log/main.log";
  public static readonly DEPENDEND_OBJECT_LIST: string = ".ldm/tmp/dependend-object-list.json";
  public static readonly CHANGED_OBJECT_LIST: string = ".ldm/tmp/changed-object-list.json";
  public static readonly REMOTE_ldm_PYTHON_PATH: string = "venv/bin/python";
  public static readonly DEPLOYMENT_CONFIG_FILE: string = ".ldm/etc/deployment.toml";

  public static readonly DEPENDENCY_LIST: string = ".ldm/etc/dependency.json";
  public static readonly SOURCE_LIST: string = ".ldm/etc/source-list.json";
  public static readonly REMOTE_SOURCE_LIST: string = '.ldm/etc/source-list-remote.json';
  public static readonly COMPILED_OBJECT_LIST: string = '.ldm/etc/object-builds.json';

}
