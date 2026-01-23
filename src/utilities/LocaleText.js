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
exports.LocaleText = void 0;
const DirTool_1 = require("./DirTool");
const path = __importStar(require("path"));
// https://www.eliostruyf.com/localization-visual-studio-code-extensions/
class LocaleText {
    /**
     *
     */
    constructor(locale, context) {
        this.current_lang = undefined;
        this.default_lang = undefined; // english
        this.current_locale = locale;
        this.current_lang = DirTool_1.DirTool.get_json(path.join(context.extensionPath, `package.nls.${locale}.json`));
        this.default_lang = DirTool_1.DirTool.get_json(path.join(context.extensionPath, `package.nls.json`));
        this._context = context;
    }
    static init(locale, context) {
        LocaleText.localeText = new LocaleText(locale, context);
    }
    /**
     * Get text in national language
     *
     * @param {string} key
     * @returns {string} Text in national language. If not found `key` gets returned
     */
    get_Text(key) {
        if (this.current_lang && this.current_lang[key])
            return this.current_lang[key];
        if (this.default_lang && this.default_lang[key])
            return this.default_lang[key];
        if (this.default_lang) {
            this.default_lang[key] = key;
            DirTool_1.DirTool.write_file(path.join(this._context.extensionPath, `package.nls.json`), JSON.stringify(this.default_lang, undefined, 2));
        }
        return key;
    }
}
exports.LocaleText = LocaleText;
LocaleText.localeText = undefined;
