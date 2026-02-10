export class LBRConstants {
  static CONFIG_TOML = '.lbr/etc/app-config.toml';
  static CONFIG_USER_TOML = '.lbr/etc/.user-app-config.toml';
  static SOURCE_CONFIG_TOML = '.lbr/etc/source-config.toml';
  static DEPENDEND_OBJECT_LIST = '.lbr/tmp/dependend-object-list.json';
  static CHANGED_OBJECT_LIST = '.lbr/tmp/changed-object-list.json';
  static EXTENDED_SOURCE_PROCESS_CONFIG_TOML = '.lbr/etc/extended-source-processing-config.toml';
  static ESP_SCRIPT_FOLDER='.lbr/etc/scripts';
  static UPDATE_OBJECT_LIST = false;
  static JOB_LOG = '.lbr/log/joblog.txt';

  private static constants: Record<string, any> = {};

  static get(key: string, defaultValue: any = null): any {
    // In a real scenario, you might fetch this from a config file or environment variables
    if (key in LBRConstants) {
      return (LBRConstants as any)[key];
    }
    return defaultValue;
  }
}
