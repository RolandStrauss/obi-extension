"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemCmdExecution = void 0;
const child_process_1 = require("child_process");
const Logger_1 = require("../utilities/Logger");
class SystemCmdExecution {
    static async run_system_cmd(cwd, cmd, id) {
        // Use platform-specific shell
        if (process.platform === "win32") {
            cwd = cwd.replace(/%([^%]+)%/g, (_, n) => process.env[n] ?? `%${n}%`);
            //    cmd = `cmd.exe /c ${cmd}`;
        }
        console.log({
            platform: process.platform,
            arch: process.arch,
            comspec: process.env.ComSpec,
            systemroot: process.env.SystemRoot
        });
        const child = (0, child_process_1.spawn)(cmd, { cwd: cwd, shell: true });
        SystemCmdExecution.processes[id] = child;
        return new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                const cmd_info = `${id} | cmd: '${cmd}' | stdout: ${data}`;
                Logger_1.logger.debug(cmd_info);
            });
            child.stderr.on('data', (data) => {
                const cmd_info = `${id} | cmd: '${cmd}' | stderr: ${data}`;
                Logger_1.logger.error(cmd_info);
            });
            child.on('exit', (code, signal) => {
                const cmd_info = `${id} | exit-code: ${code} | signal: ${signal} | cmd: '${cmd}'`;
                if (code !== 0) {
                    const error = `System command failed: ${cmd_info}`;
                    Logger_1.logger.error(error);
                    reject(new Error(error));
                }
                Logger_1.logger.debug(`System command succeeded: ${cmd_info}`);
                resolve();
            });
            child.on('error', (err) => {
                const cmd_error = `System command error: ${id} | error: ${err} | cmd: '${cmd}'`;
                Logger_1.logger.error(cmd_error);
                reject(new Error(cmd_error));
            });
        });
    }
    static abort_system_cmd(id) {
        if (SystemCmdExecution.processes[id]) {
            SystemCmdExecution.processes[id].kill();
            delete SystemCmdExecution.processes[id];
        }
    }
}
exports.SystemCmdExecution = SystemCmdExecution;
SystemCmdExecution.processes = {};
