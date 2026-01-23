export class ldmConstants {
  static CONFIG_TOML = '.ldm/etc/app-config.toml';
  static CONFIG_USER_TOML = '.ldm/etc/.user-app-config.toml';
  static SOURCE_CONFIG_TOML = '.ldm/etc/source-config.toml';
  static DEPENDEND_OBJECT_LIST = '.ldm/tmp/dependend-object-list.json';
  static CHANGED_OBJECT_LIST = '.ldm/tmp/changed-object-list.json';
  static EXTENDED_SOURCE_PROCESS_CONFIG_TOML = '.ldm/etc/extended-source-processing-config.toml';
  static ESP_SCRIPT_FOLDER='.ldm/etc/scripts';
  static UPDATE_OBJECT_LIST = false;
  static JOB_LOG = '.ldm/log/joblog.txt';

  private static constants: Record<string, any> = {};

  static get(key: string, defaultValue: any = null): any {
    // In a real scenario, you might fetch this from a config file or environment variables
    if (key in ldmConstants) {
      return (ldmConstants as any)[key];
    }
    return defaultValue;
  }
}
