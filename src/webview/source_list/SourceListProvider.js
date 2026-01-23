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
exports.SourceListItem = exports.SourceListProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DirTool_1 = require("../../utilities/DirTool");
const SourceList_1 = require("./SourceList");
const Constants_1 = require("../../Constants");
const Logger_1 = require("../../utilities/Logger");
const AppConfig_1 = require("../controller/AppConfig");
const Workspace_1 = require("../../utilities/Workspace");
const SourceListConfig_1 = require("./SourceListConfig");
const LBTTools_1 = require("../../utilities/LBTTools");
class SourceListProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = '';
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.items = [];
        if (workspaceRoot !== undefined) {
            this.workspaceRoot = workspaceRoot;
        }
        SourceListProvider.source_list_provider = this;
    }
    getTreeItem(element) {
        if (element.list_level != 'source-member') {
            return element;
        }
        return element;
    }
    getChildren(element) {
        if (!this.workspaceRoot) {
            return Promise.resolve([]);
        }
        if (element) {
            return this.get_child_elements(element);
        }
        const source_list_path = path.join(this.workspaceRoot, Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME);
        if (!DirTool_1.DirTool.dir_exists(source_list_path)) {
            return Promise.resolve([]);
        }
        let child = [];
        const source_list = DirTool_1.DirTool.list_dir(source_list_path);
        for (let index = 0; index < source_list.length; index++) {
            const element = source_list[index];
            const file = path.join(this.workspaceRoot, Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, element);
            if (!DirTool_1.DirTool.is_file(file)) {
                continue;
            }
            //lbtTools.get_filtered_sources_with_details(element).then((result) => {
            //  SourceListProvider.source_lists[element] = result;
            //});
            SourceListProvider.source_lists[element] = LBTTools_1.lbtTools.get_filtered_sources_with_details(element);
            const new_child = new SourceListItem(element.replaceAll('.json', ''), '', vscode.TreeItemCollapsibleState.Collapsed, element, 'source-list');
            this.items.push(new_child);
            child.push(new_child);
        }
        return Promise.resolve(child);
    }
    async get_child_elements(element) {
        let content_list = [];
        let item;
        let level = 'source-list';
        let results = [];
        let description = undefined;
        let lib;
        let file;
        let member;
        let path;
        let collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        const sources = await SourceListProvider.source_lists[element['source_list']];
        if (element.list_level == 'source-list') {
            level = 'source-lib';
        }
        if (element.list_level == 'source-lib') {
            level = 'source-file';
            lib = element.label;
            collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }
        if (element.list_level == 'source-file') {
            level = 'source-member';
            lib = element.src_lib;
            file = element.label;
            collapsibleState = vscode.TreeItemCollapsibleState.None;
        }
        content_list = SourceListProvider.get_values_by_key(sources, level, lib, file);
        // Read each source list entry
        for (const entry of content_list) {
            if (level == 'source-member') {
                if (entry['source-member'] == '') {
                    continue;
                }
                description = entry['description'] || undefined;
                member = entry[level];
            }
            item = new SourceListItem(entry[level], description, collapsibleState, element.source_list, level, lib, file, member);
            this.items.push(item);
            results.push(item);
        }
        return results;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    async add_new_source_filter() {
        const source_list = await vscode.window.showInputBox({ title: `Name of source filter`, placeHolder: "source filter name", validateInput(value) {
                if (value.replace(/[\/|\\:*?"<>]/g, " ") != value) {
                    return "Not allowed characters: \\, /, |, :, *, ?, \", <, >";
                }
                return null;
            }, });
        if (!source_list) {
            throw new Error('Canceled by user. No source filter name provided');
        }
        const ws = Workspace_1.Workspace.get_workspace();
        const data = [{ "source-lib": '*', "source-file": '*', 'source-member': '*', "use-regex": false, "show-empty-folders": true }];
        DirTool_1.DirTool.write_file(path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, `${source_list}.json`), JSON.stringify(data, undefined, 2));
        return `${source_list}.json`;
    }
    // lbt.source-filter.add-source-file
    async add_new_source_file(item) {
        const app_config = AppConfig_1.AppConfig.get_app_config();
        const source_file_folder = await vscode.window.showInputBox({ title: `Name of source folder for ${item.src_lib}`, placeHolder: "qrpglesrc", validateInput(value) {
                if (value.replace(/[\/|\\:*?"<>]/g, " ") != value) {
                    return "Not allowed characters: \\, /, |, :, *, ?, \", <, >";
                }
                return null;
            }, });
        if (!source_file_folder || !item.label) {
            throw new Error('Canceled by user. No source folder name provided');
        }
        const ws = Workspace_1.Workspace.get_workspace();
        const src_folder = app_config.general['source-dir'] || 'src';
        const new_folder = path.join(ws || '', src_folder, item.label, source_file_folder);
        // Create the new directory if it doesn't exist
        if (!DirTool_1.DirTool.dir_exists(new_folder)) {
            fs.mkdirSync(new_folder, { recursive: true });
        }
        return source_file_folder;
    }
    // lbt.source-filter.add-source-member
    async add_new_source_member(item) {
        const app_config = AppConfig_1.AppConfig.get_app_config();
        const source_member = await vscode.window.showInputBox({ title: `Name of source member for ${item.src_lib}/${item.label}`,
            placeHolder: "source member name",
            validateInput(value) {
                if (value.replace(/[\/|\\:*?"<>]/g, " ") != value) {
                    return "Not allowed characters: \\, /, |, :, *, ?, \", <, >";
                }
                const ext = path.extname(value).replace('.', '').toLowerCase();
                if (app_config.general['supported-object-types'] && !app_config.general['supported-object-types'].includes(ext)) {
                    return `Extension ".${ext}" is not supported (supported: ${app_config.general['supported-object-types'].join(', ')})`;
                }
                return null;
            },
        });
        if (!source_member || !item.src_lib) {
            throw new Error('Canceled by user. No source member name provided');
        }
        const ws = Workspace_1.Workspace.get_workspace();
        const src_folder = app_config.general['source-dir'] || 'src';
        const new_file = path.join(ws || '', src_folder, item.src_lib, item.label, source_member);
        DirTool_1.DirTool.write_file(new_file, '');
        vscode.window.showTextDocument(vscode.Uri.file(new_file));
        return source_member;
    }
    // lbt.source-filter.add-source-file
    async change_source_description(item) {
        const config = AppConfig_1.AppConfig.get_app_config();
        let lib = '';
        let file = '';
        let member = '';
        let source_path = '';
        let description = '';
        const src_dir = config.general['source-dir'] || 'src';
        Logger_1.logger.debug(`Changing source description for item: ${JSON.stringify(item, null, 2)}`);
        if (item instanceof SourceListItem) {
            if (!item.member_path_lbt || !item.src_member) {
                throw new Error('Source member information missing');
            }
            source_path = item.member_path_lbt;
            member = item.src_member;
            description = typeof item.description === 'string' ? item.description : '';
        }
        if (item instanceof vscode.Uri) {
            Logger_1.logger.debug(`Changing source description for URI: ${item.fsPath}`);
            source_path = LBTTools_1.lbtTools.convert_local_filepath_2_lbt_filepath(item.fsPath, true);
            const match = source_path.match(/^([^\/]+)\/([^\/]+)\/(.+)$/);
            if (!match) {
                throw new Error(`Source path ${source_path} is not valid`);
            }
            lib = match[1];
            file = match[2];
            source_path = `${lib}/${file}`;
            member = match[3];
            Logger_1.logger.debug(`Changing description for source member: lib='${lib}', file='${file}', member='${member}'`);
            const source_infos = await LBTTools_1.lbtTools.get_source_infos();
            if (source_infos[`${source_path}/${member}`]) {
                description = typeof source_infos[`${source_path}/${member}`].description === 'string' ? source_infos[`${source_path}/${member}`].description : '';
            }
        }
        const new_description = await vscode.window.showInputBox({
            title: `Description of source member for ${source_path}/${member}`,
            placeHolder: "Source description",
            value: description,
        });
        if (!new_description) {
            throw new Error('Canceled by user. No source description provided');
        }
        LBTTools_1.lbtTools.update_source_infos(source_path, member, new_description);
        return;
    }
    // lbt.source-filter.add-source-file
    async rename_source_member(item) {
        const app_config = AppConfig_1.AppConfig.get_app_config();
        if (!(item instanceof SourceListItem)) {
            throw new Error('Item must be a SourceListItem');
        }
        if (!item.src_lib || !item.src_file || !item.src_member) {
            throw new Error('Source member information missing');
        }
        const new_name = await vscode.window.showInputBox({
            title: `Rename source member for ${item.src_member}`,
            value: item.src_member,
            validateInput(value) {
                if (value.replace(/[\/|\\:*?"<>]/g, " ") != value) {
                    return "Not allowed characters: \\, /, |, :, *, ?, \", <, >";
                }
                const ext = path.extname(value).replace('.', '').toLowerCase();
                if (app_config.general['supported-object-types'] && !app_config.general['supported-object-types'].includes(ext)) {
                    return `Extension ".${ext}" is not supported (supported: ${app_config.general['supported-object-types'].join(', ')})`;
                }
                return null;
            },
        });
        if (!new_name) {
            throw new Error('Canceled by user. No source name provided');
        }
        const ws = Workspace_1.Workspace.get_workspace();
        const from_path = path.join(ws || '', item.member_path, item.src_member);
        const to_path = path.join(ws || '', item.member_path, new_name);
        fs.renameSync(from_path, to_path);
        const source_infos = await LBTTools_1.lbtTools.get_source_infos();
        if (source_infos[`${item.member_path_lbt}/${item.src_member}`]) {
            const description = typeof source_infos[`${item.member_path_lbt}/${item.src_member}`].description === 'string' ? source_infos[`${item.member_path_lbt}/${item.src_member}`].description : '';
            LBTTools_1.lbtTools.update_source_infos(item.member_path_lbt, new_name, description);
        }
        return;
    }
    // lbt.source-filter.add-source-file
    async delete_source_member(item) {
        const app_config = AppConfig_1.AppConfig.get_app_config();
        if (!(item instanceof SourceListItem)) {
            throw new Error('Item must be a SourceListItem');
        }
        if (!item.src_lib || !item.src_file || !item.src_member) {
            throw new Error('Source member information missing');
        }
        const ws = Workspace_1.Workspace.get_workspace();
        const from_path = path.join(ws || '', item.member_path, item.src_member);
        fs.unlinkSync(from_path);
        return;
    }
    register(context) {
        // setup
        const options = {
            treeDataProvider: this,
            showCollapseAll: true
        };
        // build
        vscode.window.registerTreeDataProvider('lbt.source-filter', this);
        // create
        const tree = vscode.window.createTreeView('lbt.source-filter', options);
        vscode.commands.registerCommand('lbt.source-filter.update', () => {
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.source-filter.add', () => {
            this.add_new_source_filter().then((source_list) => {
                this.refresh();
                if (source_list) {
                    SourceListConfig_1.SourceListConfig.render(context, source_list);
                }
            });
        });
        vscode.commands.registerCommand('lbt.source-filter.show-view', async (item) => {
            SourceList_1.SourceList.render(context.extensionUri, Workspace_1.Workspace.get_workspace_uri(), item.source_list);
        });
        vscode.commands.registerCommand('lbt.source-filter.edit-config', async (item) => {
            SourceListConfig_1.SourceListConfig.render(context, item.source_list);
        });
        vscode.commands.registerCommand('lbt.source-filter.delete-config', async (item) => {
            if (SourceListConfig_1.SourceListConfig.currentPanel && SourceListConfig_1.SourceListConfig.source_list_file == item.source_list) {
                SourceListConfig_1.SourceListConfig.currentPanel.dispose();
            }
            const ws = Workspace_1.Workspace.get_workspace();
            fs.rmSync(path.join(ws || '', Constants_1.Constants.SOURCE_FILTER_FOLDER_NAME, item.source_list));
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.source-filter.add-source-member', async (item) => {
            const source_member = await this.add_new_source_member(item);
            this.refresh();
            //Why ??? if (source_member)
            //  SourceListConfig.render(context, source_member);
        });
        vscode.commands.registerCommand('lbt.source-filter.add-source-file', async (item) => {
            const source_file = await this.add_new_source_file(item);
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.source-filter.change-source-description', async (item) => {
            await this.change_source_description(item);
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.source-filter.rename-source-member', async (item) => {
            await this.rename_source_member(item);
            this.refresh();
        });
        vscode.commands.registerCommand('lbt.source-filter.delete-source-member', async (item) => {
            await this.delete_source_member(item);
            this.refresh();
        });
        // setup: events
        tree.onDidChangeSelection(e => {
            Logger_1.logger.info(`onDidChangeSelection: ${e}`); // breakpoint here for debug
            if (e.selection.length == 0) {
                return;
            }
            Logger_1.logger.info(e); // breakpoint here for debug
        });
        tree.onDidCollapseElement(e => {
            Logger_1.logger.info(`Collapse: ${e}`); // breakpoint here for debug
        });
        tree.onDidChangeVisibility(e => {
            Logger_1.logger.info(`ChangeVisibility: ${e}`); // breakpoint here for debug
        });
        tree.onDidExpandElement(e => {
            Logger_1.logger.info(`Expand: ${e}`); // breakpoint here for debug
        });
        // subscribe
        context.subscriptions.push(tree);
    }
    static get_values_by_key(source_list, key, lib, file) {
        let result = [];
        let item = {};
        for (let i = 0; i < source_list.length; i++) {
            const element = source_list[i];
            const value = element[key];
            item = {};
            item[key] = value;
            if (result.some(e => e[key] === value) || lib && lib != element['source-lib'] || file && file != element['source-file']) {
                continue;
            }
            if (key == 'source-member') {
                item['description'] = element.description;
            }
            item[key] = element[key];
            result.push(item);
        }
        return result;
    }
}
exports.SourceListProvider = SourceListProvider;
SourceListProvider.source_lists = {};
class SourceListItem extends vscode.TreeItem {
    //public readonly contextValue?: string | undefined;
    constructor(label, description, collapsibleState, source_list, list_level, src_lib, src_file, src_member) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.tooltip = source_list;
        switch (list_level) {
            case 'source-lib':
                this.tooltip = `${source_list}: ${label}`;
                break;
            case 'source-file':
                this.tooltip = `${source_list}: ${src_lib}/${label}`;
                break;
            case 'source-member':
                this.tooltip = `${source_list}: ${src_lib}/${src_file}(${src_member})`;
                break;
        }
        if (typeof description !== 'undefined' && description?.length > 0) {
            this.tooltip += ` - ${description}`;
        }
        this.description = description;
        this.source_list = source_list;
        this.list_level = list_level;
        let member_file_path = '';
        let icon = 'edit.svg';
        this.contextValue = list_level;
        this.src_lib = src_lib;
        this.src_file = src_file;
        this.src_member = src_member;
        let ws = '';
        if (vscode.workspace.workspaceFolders) {
            ws = vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        if (['source-member', 'source_list'].indexOf(list_level) == -1) {
            return;
        }
        if (list_level == 'source-member') {
            this.member_path_lbt = LBTTools_1.lbtTools.convert_local_filepath_2_lbt_filepath(path.join(this.src_lib || '', this.src_file || ''));
            this.member_path = path.join(AppConfig_1.AppConfig.get_app_config().general['source-dir'] || 'src', this.member_path_lbt);
            member_file_path = path.join(this.member_path, this.src_member || '');
            if (!DirTool_1.DirTool.file_exists(path.join(ws, member_file_path))) {
                icon = 'error.svg';
            }
        }
        this.iconPath = {
            light: vscode.Uri.file(path.join(__filename, '..', '..', '..', '..', 'asserts', 'img', 'light', icon)),
            dark: vscode.Uri.file(path.join(__filename, '..', '..', '..', '..', 'asserts', 'img', 'dark', icon))
        };
        if (list_level != 'source-member') {
            return;
        }
        this.contextValue = 'lbt-source';
        this.command = {
            command: 'vscode.open',
            title: 'Open source member',
            arguments: [
                DirTool_1.DirTool.get_file_URI(member_file_path)
            ]
        };
    }
}
exports.SourceListItem = SourceListItem;
