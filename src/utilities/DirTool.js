'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirTool = void 0;
const vscode = __importStar(require("vscode"));
const Logger_1 = require("./Logger");
const AppConfig_1 = require("../webview/controller/AppConfig");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Workspace_1 = require("./Workspace");
const crypto = require('crypto');
class DirTool {
    static resolve_env_in_path(path) {
        const envPatternUnix = /\$(\w+)/g;
        const envPatternWindows = /%(\w+)%/g;
        path = path.replace(envPatternUnix, (_, envVar) => process.env[envVar] || _);
        path = path.replace(envPatternWindows, (_, envVar) => process.env[envVar] || _);
        return path;
    }
    static *get_all_files_in_dir(rootdir, dir, file_extensions) {
        if (!DirTool.dir_exists(path.join(rootdir, dir)))
            return undefined;
        const fs = require('fs');
        const files = fs.readdirSync(path.join(rootdir, dir), { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                yield* DirTool.get_all_files_in_dir(rootdir, path.join(dir, file.name), file_extensions);
            }
            else {
                if (file_extensions.includes(file.name.split('.').pop()))
                    yield path.join(dir, file.name);
            }
        }
    }
    /**
     * List files in a directory recursive
     * It's async for better performance
     * @param rootdir
     * @param dir
     * @param file_extensions
     * @returns
     */
    static async get_all_files_in_dir2(rootdir, dir, file_extensions, replace_backslash = false) {
        if (!DirTool.dir_exists(path.join(rootdir, dir)))
            return undefined;
        let file_list = [];
        let call_list = [];
        const fs = require('fs');
        const files = fs.readdirSync(path.join(rootdir, dir), { withFileTypes: true });
        let file_path;
        for (const file of files) {
            if (file.isDirectory()) {
                call_list.push(DirTool.get_all_files_in_dir2(rootdir, path.join(dir, file.name), file_extensions, replace_backslash));
            }
            else {
                if (file_extensions.includes(file.name.split('.').pop())) {
                    file_path = path.join(dir, file.name);
                    if (replace_backslash)
                        file_path = file_path.replace(/\\/g, '/');
                    file_list.push(file_path);
                }
            }
        }
        const results = await Promise.all(call_list);
        results.map((list) => {
            if (list)
                file_list = [...file_list, ...list];
        });
        return file_list;
    }
    /**
     * List files in a directory recursive
     * It's async for better performance
     * @param rootdir
     * @param dir
     * @param file_extensions
     * @returns
     */
    static async get_all_files_in_dir3(rootdir, dir, file_extensions) {
        if (!DirTool.dir_exists(path.join(rootdir, dir)))
            return undefined;
        let file_list = [];
        let call_list = [];
        const fs = require('fs');
        const files = fs.readdirSync(path.join(rootdir, dir), { withFileTypes: true });
        if (files.length == 0) {
            const path_array = dir.split('/');
            const src_lib = path_array[0] ?? null;
            const src_file = path_array[1] ?? null;
            return [{ "source-lib": src_lib, "source-file": src_file, "source-member": '', "use-regex": false, "show-empty-folders": false }];
        }
        for (const file of files) {
            if (file.isDirectory()) {
                call_list.push(DirTool.get_all_files_in_dir3(rootdir, path.join(dir, file.name), file_extensions));
            }
            else {
                if (file_extensions == undefined || file_extensions.includes(file.name.split('.').pop())) {
                    const source = path.join(dir, file.name).replaceAll('\\', '/');
                    const source_arr = source.split('/').reverse();
                    const src_mbr = source_arr[0];
                    const src_file = source_arr[1];
                    const src_lib = source_arr[2];
                    file_list.push({ "source-lib": src_lib, "source-file": src_file, "source-member": src_mbr, "use-regex": false, "show-empty-folders": false });
                }
            }
        }
        const results = await Promise.all(call_list);
        results.map((list) => {
            if (list)
                file_list = [...file_list, ...list];
        });
        return file_list;
    }
    static list_dir(dir) {
        dir = DirTool.resolve_env_in_path(dir);
        const files = fs.readdirSync(dir);
        return files;
    }
    static file_exists(path) {
        path = DirTool.resolve_env_in_path(path);
        if (!fs.existsSync(path))
            return false;
        if (fs.lstatSync(path).isDirectory())
            return false;
        return true;
    }
    static dir_exists(path) {
        path = DirTool.resolve_env_in_path(path);
        if (!fs.existsSync(path))
            return false;
        if (fs.lstatSync(path).isDirectory())
            return true;
        return false;
    }
    static is_file(path) {
        path = DirTool.resolve_env_in_path(path);
        const stats = fs.statSync(path);
        return stats.isFile();
    }
    static get_json(path) {
        path = DirTool.resolve_env_in_path(path);
        Logger_1.logger.debug(`Read json ${path}`);
        if (!DirTool.file_exists(path)) {
            Logger_1.logger.warn(`File does not exist: ${path}`);
            return undefined;
        }
        const fs = require("fs");
        let json_string = fs.readFileSync(path);
        // Converting to JSON
        try {
            return JSON.parse(json_string);
        }
        catch (e) {
            Logger_1.logger.error(`JSON parse error for ${path}`);
            Logger_1.logger.debug(`JSON content: ${json_string}`);
            Logger_1.logger.error(`Parsing JSON content on line ${e.line}, column ${e.column}: ${e.message}`);
        }
    }
    static get_file_changed_date(file) {
        file = DirTool.resolve_env_in_path(file);
        const { mtime, ctime } = fs.statSync(file);
        return mtime;
    }
    static write_json(file, data) {
        file = DirTool.resolve_env_in_path(file);
        if (!DirTool.dir_exists(path.dirname(file))) {
            fs.mkdirSync(path.dirname(file), { recursive: true });
        }
        try {
            // Read the TOML file into a string
            const text = JSON.stringify(data, null, 2);
            Logger_1.logger.info(`Writing JSON to file 2: ${path.resolve(file)}`);
            fs.writeFileSync(file, text, 'utf8');
        }
        catch (e) {
            Logger_1.logger.error(`Error in json file: ${file}`);
        }
        return;
    }
    static get_file_URI(file) {
        let scheme = 'file';
        let remote_ws_host = '';
        if (vscode.env.remoteName) {
            scheme = 'vscode-remote';
            remote_ws_host = AppConfig_1.AppConfig.get_app_config().general['cloud-ws-ssh-remote-host'] || vscode.env.remoteName;
        }
        const fileUri = {
            scheme: scheme,
            path: path.join(Workspace_1.Workspace.get_workspace(), file),
            authority: remote_ws_host
        };
        return fileUri;
    }
    static get_encoded_file_URI(file) {
        return encodeURIComponent(JSON.stringify(DirTool.get_file_URI(file)));
    }
    static get_encoded_source_URI(workspaceUri, file) {
        const config = AppConfig_1.AppConfig.get_app_config();
        return DirTool.get_encoded_file_URI(path.join(config.general["source-dir"], file));
    }
    static get_encoded_build_output_URI(file) {
        const config = AppConfig_1.AppConfig.get_app_config();
        return DirTool.get_encoded_file_URI(path.join(config.general["build-output-dir"], file));
    }
    static get_toml(file) {
        file = DirTool.resolve_env_in_path(file);
        if (!DirTool.file_exists(file)) {
            Logger_1.logger.warn(`File does not exist: ${file}`);
            return undefined;
        }
        const toml = require('smol-toml');
        try {
            // Read the TOML file into a string
            const data = fs.readFileSync(file, 'utf8');
            // Parse the TOML data into a javascript object
            const result = toml.parse(data);
            return result;
        }
        catch (e) {
            Logger_1.logger.error(`Error in toml file: ${file}`);
            Logger_1.logger.error(`Parsing toml content on line ${e.line}, column ${e.column}: ${e.message}`);
        }
        return undefined;
    }
    static write_toml(file, data) {
        file = DirTool.resolve_env_in_path(file);
        if (!DirTool.dir_exists(path.dirname(file))) {
            fs.mkdirSync(path.dirname(file), { recursive: true });
        }
        const toml = require('smol-toml');
        try {
            // Read the TOML file into a string
            const text = toml.stringify(data);
            fs.writeFileSync(file, text, 'utf8');
        }
        catch (e) {
            Logger_1.logger.error(`Error in toml file: ${file}`);
            Logger_1.logger.error(`Parsing toml content on line ${e.line}, column ${e.column}: ${e.message}`);
        }
        return;
    }
    static write_file(file, content) {
        file = DirTool.resolve_env_in_path(file);
        Logger_1.logger.info(`Write data to ${file}`);
        try {
            if (!DirTool.dir_exists(path.dirname(file)))
                fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, content, 'utf8');
        }
        catch (e) {
            Logger_1.logger.error(`Error write file: ${file}: ${e.message}`);
            if (e.line)
                Logger_1.logger.error(`Parsing toml content on line ${e.line}, column ${e.column}: ${e.message}`);
        }
        return;
    }
    static get_key_value_file(file) {
        file = DirTool.resolve_env_in_path(file);
        let key_values = {};
        if (!DirTool.file_exists(file))
            return undefined;
        try {
            // Read the TOML file into a string
            const data = fs.readFileSync(file, 'utf8');
            return data.toString().split('\n');
        }
        catch (e) {
            Logger_1.logger.error(`Error in toml file: ${file}`);
            Logger_1.logger.error(`Parsing toml content on line ${e.line}, column ${e.column}: ${e.message}`);
        }
        return undefined;
    }
    static get_file_content(file) {
        file = DirTool.resolve_env_in_path(file);
        if (!DirTool.file_exists(file))
            return undefined;
        try {
            // Read the TOML file into a string
            const data = fs.readFileSync(file, 'utf8');
            return data.toString();
        }
        catch (e) {
            Logger_1.logger.error(`Error on reading ${file}`);
        }
        return undefined;
    }
    static clean_dir(file) {
        file = DirTool.resolve_env_in_path(file);
        fs.rmSync(file, { recursive: true, force: true });
        fs.mkdirSync(file);
    }
    static get_shell_config(file) {
        file = DirTool.resolve_env_in_path(file);
        const content_list = DirTool.get_key_value_file(file);
        if (!content_list)
            return undefined;
        let key_values = {};
        for (var i = 0; i < content_list.length; i++) {
            const line = content_list[i].trim().split('#');
            if (line[0].length == 0)
                continue;
            const line2 = content_list[i].trim().split('source ');
            if (line2[0].length == 0)
                continue;
            const k_v = line[0].trim().split('=');
            key_values[k_v[0]] = k_v[1];
        }
        return key_values;
    }
    /*
      public static async get_hash_file(file:string): Promise<string> {
    
        const hasha = require('hasha');
    
        // Get the MD5 hash of an image
        const fileHash = await hasha.fromFile(file, {algorithm: 'md5'});
    
        return fileHash;
      }
    
    
          var fs = require('fs')
        var crypto = require('crypto')
        return new Promise((resolve, reject) => {
          const hash = crypto.createHash('sha256');
          const stream = fs.createReadStream(path);
          stream.on('error', err => reject(err));
          stream.on('data', chunk => hash.update(chunk));
          stream.on('end', () => resolve(hash.digest('hex')));
        });
        */
    static async checksumFile(root, file_path) {
        root = DirTool.resolve_env_in_path(root);
        file_path = DirTool.resolve_env_in_path(file_path);
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(path.join(root, file_path));
            stream.on('error', err => reject(err));
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => {
                resolve({ [file_path]: String(hash.digest('hex')) });
            });
        });
    }
    static delete_file(file) {
        if (DirTool.file_exists(file)) {
            fs.unlinkSync(file);
        }
    }
}
exports.DirTool = DirTool;
