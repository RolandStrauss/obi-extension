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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const vscode = __importStar(require("vscode"));
const winston = __importStar(require("winston"));
const winston_transport_1 = __importDefault(require("winston-transport"));
const path = __importStar(require("path"));
const Constants_1 = require("../Constants");
const fs = __importStar(require("fs"));
const outputChannel = vscode.window.createOutputChannel(`lbt`);
let ws = '';
if (vscode.workspace.workspaceFolders) {
    ws = vscode.workspace.workspaceFolders[0].uri.fsPath;
}
//const winston = require('winston');
class CustomTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
    }
    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        const { level, message, ...meta } = info;
        // do whatever you want with log data
        outputChannel.appendLine(`${new Date().toISOString()} - ${level} - ${message}`);
        callback();
    }
}
;
const myCustomTransport = new CustomTransport({});
exports.logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), winston.format.align(), winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    //defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.Console(),
        myCustomTransport
    ],
});
if (fs.existsSync(path.join(ws, Constants_1.Constants.LBT_APP_CONFIG_FILE))) {
    exports.logger.add(new winston.transports.File({ dirname: path.join(ws, '.lbt', 'log'), filename: 'error.log', level: 'error' }));
    exports.logger.add(new winston.transports.File({ dirname: path.join(ws, '.lbt', 'log'), filename: 'combined.log' }));
}
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
//logger.add(new winston.transports.Console({
//  format: winston.format.simple(),
//}));
