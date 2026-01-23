import * as assert from 'assert';
import * as vscode from 'vscode';
import { Workspace, WorkspaceSettings } from '../utilities/Workspace';

suite('Workspace Test Suite', () => {

	test('WorkspaceSettings - Should create empty object', () => {
		const settings: WorkspaceSettings = {};
		assert.strictEqual(typeof settings, 'object');
	});

	test('WorkspaceSettings - Should store current_profile', () => {
		const settings: WorkspaceSettings = {
			current_profile: 'test_profile'
		};
		assert.strictEqual(settings.current_profile, 'test_profile');
	});

	test('get_workspace - Should return undefined when no workspace is open', () => {
		// This test will pass only when no workspace is open
		// In actual extension environment with workspace, it should return a path
		if (!vscode.workspace.workspaceFolders) {
			const workspace = Workspace.get_workspace();
			assert.strictEqual(workspace, undefined);
		} else {
			// If workspace is open, verify it returns a string
			const workspace = Workspace.get_workspace();
			assert.strictEqual(typeof workspace, 'string');
		}
	});

	test('get_workspace_uri - Should throw when no workspace is available', () => {
		if (!vscode.workspace.workspaceFolders) {
			assert.throws(() => {
				Workspace.get_workspace_uri();
			}, Error);
		} else {
			// If workspace is open, verify it returns a Uri
			const uri = Workspace.get_workspace_uri();
			assert.ok(uri instanceof vscode.Uri);
		}
	});
});
