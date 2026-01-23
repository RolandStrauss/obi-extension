export class lbtConstants {
  static CONFIG_TOML = '.lbt/etc/app-config.toml';
  static CONFIG_USER_TOML = '.lbt/etc/.user-app-config.toml';
  static SOURCE_CONFIG_TOML = '.lbt/etc/source-config.toml';
  static DEPENDEND_OBJECT_LIST = '.lbt/tmp/dependend-object-list.json';
  static CHANGED_OBJECT_LIST = '.lbt/tmp/changed-object-list.json';
  static EXTENDED_SOURCE_PROCESS_CONFIG_TOML = '.lbt/etc/extended-source-processing-config.toml';
  static ESP_SCRIPT_FOLDER='.lbt/etc/scripts';
  static UPDATE_OBJECT_LIST = false;
  static JOB_LOG = '.lbt/log/joblog.txt';

  private static constants: Record<string, any> = {};

  static get(key: string, defaultValue: any = null): any {
    // In a real scenario, you might fetch this from a config file or environment variables
    if (key in lbtConstants) {
      return (lbtConstants as any)[key];
    }
    return defaultValue;
  }
}

