"use strict";
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
exports.SSH_Tasks = void 0;
const vscode = __importStar(require("vscode"));
const node_ssh_1 = require("node-ssh");
const Workspace_1 = require("./Workspace");
const path = __importStar(require("path"));
const AppConfig_1 = require("../webview/controller/AppConfig");
const Constants_1 = require("../Constants");
const Logger_1 = require("./Logger");
class SSH_Tasks {
    static get_ssh_user() {
        // Execute command in bash shell
        if (!SSH_Tasks.ssh_user || SSH_Tasks.ssh_user.length == 0) {
            const config = AppConfig_1.AppConfig.get_app_config();
            SSH_Tasks.ssh_user = config.connection['ssh-user'];
        }
        return SSH_Tasks.ssh_user;
    }
    static get_finalized_command(cmd) {
        // Execute command in bash shell
        return `bash -c '${cmd.replace(/'/g, "''")}'`;
    }
    static get_finalized_remote_path(path) {
        // Execute command in bash shell
        const ssh_user = SSH_Tasks.get_ssh_user() || 'UNKNOWN';
        return path.replace(/\$USER/g, ssh_user).replace(/~/g, `/home/${ssh_user}`); // Replace ~ with /home/$USER
    }
    static async connect(callback) {
        const config = AppConfig_1.AppConfig.get_app_config();
        let host = config.connection['remote-host'];
        let ssh_user = SSH_Tasks.get_ssh_user();
        const ssh_key = config.connection['ssh-key'];
        if (!host || host.length == 0) {
            host = await vscode.window.showInputBox({ title: `Enter an IBM i hostname/IP`, placeHolder: "my-ibm-i" });
            if (!host)
                throw new Error('Canceled by user. No host provided');
        }
        if (!ssh_user || ssh_user.length == 0) {
            ssh_user = await vscode.window.showInputBox({ title: `Enter your user for ${host}`, placeHolder: "usrprf" });
            if (!ssh_user)
                throw new Error('Canceled by user. No user provided');
        }
        let pwd = await SSH_Tasks.context.secrets.get(`lbt|${host}|${ssh_user}`);
        if (!pwd && (!ssh_key || ssh_key.length == 0)) {
            pwd = await vscode.window.showInputBox({ title: `Enter your password for ${ssh_user}@${host}`, placeHolder: "password", password: true });
            if (!pwd)
                throw new Error('Canceled by user. No password provided');
        }
        if (SSH_Tasks.ssh.isConnected())
            return;
        await SSH_Tasks.ssh.connect({
            host: host,
            username: ssh_user,
            password: pwd,
            privateKeyPath: ssh_key,
            keepaliveInterval: 3600
        }).catch((reason) => {
            vscode.window.showErrorMessage(reason.message);
            Logger_1.logger.error(`Connection error: ${reason.message}`);
            throw reason;
        });
        vscode.window.showInformationMessage(`Connected to ${host}`);
        Logger_1.logger.info(`Connected to ${host}`);
        if (callback) {
            const result = await callback();
            return result;
        }
    }
    static async executeCommand(cmd, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                throw Error(`Could not connect to remote server`);
            }
            const func = () => { SSH_Tasks.executeCommand(cmd, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        cmd = this.get_finalized_command(cmd);
        Logger_1.logger.info(`Execute: ${cmd}`);
        const result = await SSH_Tasks.ssh.execCommand(cmd);
        Logger_1.logger.info(`CODE: ${result.code}`);
        Logger_1.logger.info(`STDOUT: ${result.stdout}`);
        if (result.stderr.length > 0)
            Logger_1.logger.error(`STDERR: ${result.stderr}`);
        if (result.code != 0)
            throw Error(result.stderr);
    }
    static async getRemoteFile(local, remote, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.getRemoteFile(local, remote, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        remote = SSH_Tasks.get_finalized_remote_path(remote);
        Logger_1.logger.info(`Get remote file. LOCAL: ${local}, REMOTE: ${remote}`);
        await SSH_Tasks.ssh.getFile(local, remote);
    }
    static async getRemoteDir(local, remote, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.getRemoteDir(local, remote, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        let failed = [];
        let successful = [];
        remote = SSH_Tasks.get_finalized_remote_path(remote);
        await SSH_Tasks.ssh.getDirectory(local, remote, { recursive: true,
            concurrency: AppConfig_1.AppConfig.get_app_config().connection['ssh-concurrency'] ?? 5,
            validate: function (itemPath) {
                const baseName = path.basename(itemPath);
                return baseName !== '.git' && // Don't send git directory
                    baseName !== '.vscode' &&
                    baseName !== '.theia' &&
                    baseName !== '.project' &&
                    baseName !== '.gitignore';
            },
            tick: function (localPath, remotePath, error) {
                if (error) {
                    failed.push(localPath);
                    Logger_1.logger.error(`Transfer error: ${error}; Local: ${localPath}, Remote: ${remotePath}`);
                }
                else {
                    //logger.debug(`Transfered: Local: ${localPath}, Remote: ${remotePath}`);
                    successful.push(localPath);
                }
            }
        });
        if (failed.length > 0)
            Logger_1.logger.error(`Failed to transfer ${failed}`);
        Logger_1.logger.debug(`Transfered: ${successful}`);
    }
    static async check_remote_paths(files, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return false;
            }
            await SSH_Tasks.connect();
            return SSH_Tasks.check_remote_paths(files, true);
        }
        let cmd = '';
        let first = true;
        files.forEach((file) => {
            if (!first)
                cmd = `${cmd} && `;
            file = SSH_Tasks.get_finalized_remote_path(file);
            cmd = `${cmd} ls "${file}"`;
            first = false;
        });
        Logger_1.logger.info(`Check path: ${cmd}`);
        const result = await SSH_Tasks.ssh.execCommand(cmd);
        Logger_1.logger.info(`CODE: ${result.code}`);
        Logger_1.logger.info(`STDOUT: ${result.stdout}`);
        if (result.stderr.length > 0)
            Logger_1.logger.error(`STDERR: ${result.stderr}`);
        return result.code == 0;
    }
    static async delete_sources(source_list, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.delete_sources(source_list, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        if (!config.general['remote-base-dir'] || !config.general['local-base-dir'])
            throw Error(`Config attribute 'config.general.remote_base_dir' or 'config.general.local-base-dir' missing`);
        const source_dir = config.general['source-dir'] ?? 'src';
        const local_source_dir = path.join(Workspace_1.Workspace.get_workspace(), config.general['local-base-dir'], source_dir);
        const remote_source_dir = `${config.general['remote-base-dir']}/${source_dir}`;
        let cmds = [];
        source_list.map((file) => {
            let file_path = `${remote_source_dir}/${file}`;
            file_path = SSH_Tasks.get_finalized_remote_path(file_path);
            cmds.push(SSH_Tasks.ssh.execCommand(`rm ${file_path}`));
        });
        await Promise.all(cmds);
    }
    static async cleanup_directory(again, return_value) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return false;
            }
            let return_value2 = false;
            const func = () => { SSH_Tasks.cleanup_directory(true, return_value2); };
            await SSH_Tasks.connect(await func);
            return return_value2;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        if (!config.general['remote-base-dir'] || config.general['remote-base-dir'].length < 4) // to be sure it's not root!
            throw Error(`Config attribute 'config.general.remote_base_dir' invalid: ${config.general['remote-base-dir']}`);
        const remote_base_dir = SSH_Tasks.get_finalized_remote_path(config.general['remote-base-dir']);
        const answer = await vscode.window.showInformationMessage(`Process with remote folder: '${remote_base_dir}'?`, { modal: true }, ...['Yes', 'No']);
        switch (answer) {
            case 'No':
                throw new Error('Transfer canceled by user');
            case undefined:
                throw new Error('Transfer canceled by user');
            case 'Yes':
                break;
        }
        let cmd = `cd ${remote_base_dir} 2> /dev/null || mkdir -p ${remote_base_dir} && cd ${remote_base_dir} && echo "pwd: $(pwd)" || exit 1; [ \`echo $(pwd) | wc -c\` -ge 3 ] &&  echo "Current dir: $(pwd)" ||  exit 1  ;  echo "Change back from $(pwd)" &&  cd  && echo "pwd 2: $(pwd)" && rm -rf ${remote_base_dir}`;
        cmd = SSH_Tasks.get_finalized_command(cmd);
        Logger_1.logger.info(`Execute cmd: ${cmd}`);
        const result = await SSH_Tasks.ssh.execCommand(cmd);
        Logger_1.logger.info(`CODE: ${result.code}`);
        Logger_1.logger.info(`STDOUT: ${result.stdout}`);
        if (result.stderr.length > 0) {
            Logger_1.logger.error(`STDERR: ${result.stderr}`);
            vscode.window.showErrorMessage(result.stderr);
        }
        return_value = result.code == 0;
        Logger_1.logger.info(`Finished cleanup: ${return_value}`);
        return return_value;
    }
    static async transferSources(source_list, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.transferSources(source_list, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        if (!config.general['remote-base-dir'] || !config.general['local-base-dir'])
            throw Error(`Config attribute 'config.general.remote_base_dir' or 'config.general.local-base-dir' missing`);
        const source_dir = config.general['source-dir'] ?? 'src';
        const local_source_dir = path.join(Workspace_1.Workspace.get_workspace(), config.general['local-base-dir'], source_dir);
        let remote_base_dir = SSH_Tasks.get_finalized_remote_path(config.general['remote-base-dir']);
        let remote_source_dir = `${remote_base_dir}/${source_dir}`;
        let transfer_list = [
            {
                local: path.join(Workspace_1.Workspace.get_workspace(), Constants_1.Constants.LBT_APP_CONFIG_FILE),
                remote: `${remote_base_dir}/${Constants_1.Constants.LBT_APP_CONFIG_FILE}`,
            },
            {
                local: path.join(Workspace_1.Workspace.get_workspace(), AppConfig_1.AppConfig.get_current_profile_app_config_file()),
                remote: `${remote_base_dir}/${Constants_1.Constants.LBT_APP_CONFIG_USER_FILE}`,
            },
            {
                local: path.join(Workspace_1.Workspace.get_workspace(), '.lbt', 'etc', 'constants.py'),
                remote: `${remote_base_dir}/.lbt/etc/constants.py`,
            },
            {
                local: path.join(Workspace_1.Workspace.get_workspace(), '.lbt', 'etc', 'logger_config.py'),
                remote: `${remote_base_dir}/.lbt/etc/logger_config.py`,
            }
        ];
        source_list.map((source) => {
            transfer_list.push({
                local: path.join(local_source_dir, source),
                remote: `${remote_source_dir}/${source}`,
            });
        });
        Logger_1.logger.info(`Transfer files: ${source_list}`);
        await SSH_Tasks.ssh.putFiles(transfer_list, { concurrency: config.connection['ssh-concurrency'] ?? 5 });
        if (transfer_list.length == 1)
            vscode.window.showInformationMessage(`1 source transfered`);
        else
            vscode.window.showInformationMessage(`${transfer_list.length} sources transfered`);
    }
    static async transfer_files(file_list, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.transfer_files(file_list, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        const config = AppConfig_1.AppConfig.get_app_config();
        if (!config.general['remote-base-dir'] || !config.general['local-base-dir'])
            throw Error(`Config attribute 'config.general.remote_base_dir' missing`);
        const local_base_dir = path.join(Workspace_1.Workspace.get_workspace(), config.general['local-base-dir']);
        let remote_base_dir = SSH_Tasks.get_finalized_remote_path(config.general['remote-base-dir']);
        Logger_1.logger.info(`Transfer: ${file_list}`);
        let transfer_list = [];
        file_list.map((file) => {
            transfer_list.push({
                local: path.join(local_base_dir, file),
                remote: `${remote_base_dir}/${file}`,
            });
        });
        await SSH_Tasks.ssh.putFiles(transfer_list, { concurrency: config.connection['ssh-concurrency'] ?? 5 });
    }
    static async transfer_dir(local_dir, remote_dir, again) {
        // With Compression!!!!
        // https://stackoverflow.com/questions/15641243/need-to-zip-an-entire-directory-using-node-js
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.transfer_dir(local_dir, remote_dir, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        remote_dir = SSH_Tasks.get_finalized_remote_path(remote_dir);
        let final_message = "";
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Transfer project`,
        }, async (progress) => {
            progress.report({
                message: `Start transfer.`
            });
            var startTime = performance.now();
            let failed = [];
            let successful = [];
            //##############################
            // SSH transfer folder
            //##############################
            const status = await SSH_Tasks.ssh_put_dir(local_dir, remote_dir, failed, successful);
            if (status)
                vscode.window.showInformationMessage(`${successful.length} files were successfully transfered to ${remote_dir}`);
            else
                throw new Error(`${successful.length} of ${failed.length} failed transfered to ${remote_dir}`);
            var endTime = performance.now();
            final_message = `Finished transfer in ${(endTime - startTime) / 1000} seconds.`;
        });
        vscode.window.showInformationMessage(final_message);
        Logger_1.logger.info(final_message);
    }
    static async ssh_put_dir(local_dir, remote_dir, failed, successful, again) {
        if (!SSH_Tasks.ssh.isConnected()) {
            if (again) {
                vscode.window.showErrorMessage("Still no connection available");
                return;
            }
            const func = () => { SSH_Tasks.ssh_put_dir(local_dir, remote_dir, failed, successful, true); };
            await SSH_Tasks.connect(func);
            return;
        }
        remote_dir = SSH_Tasks.get_finalized_remote_path(remote_dir);
        Logger_1.logger.debug(`Send directory. Local: ${local_dir}, remote: ${remote_dir}`);
        const result = await SSH_Tasks.ssh.putDirectory(local_dir, remote_dir, {
            recursive: true,
            concurrency: AppConfig_1.AppConfig.get_app_config().connection['ssh-concurrency'] ?? 5,
            validate: function (itemPath) {
                const baseName = path.basename(itemPath);
                return baseName !== '.git' && // Don't send git directory
                    baseName !== '.vscode' &&
                    baseName !== '.theia' &&
                    baseName !== '.project' &&
                    baseName.slice(-4) !== '.pyc' && // Python cache
                    baseName !== '.gitignore';
            },
            tick: function (localPath, remotePath, error) {
                if (error) {
                    failed.push(localPath);
                }
                else {
                    successful.push(localPath);
                }
            }
        });
        if (failed.length > 0)
            Logger_1.logger.error(`Failed to transfer ${failed}`);
        Logger_1.logger.debug(`Transfered: ${successful}`);
        return result;
    }
}
exports.SSH_Tasks = SSH_Tasks;
SSH_Tasks.ssh = new node_ssh_1.NodeSSH();
SSH_Tasks.ssh_user = undefined;
