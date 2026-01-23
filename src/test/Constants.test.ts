import * as assert from 'assert';
import { Constants } from '../Constants';

suite('Constants Test Suite', () => {

	test('LBT_DIR - Should be .lbt', () => {
		assert.strictEqual(Constants.LBT_DIR, '.lbt');
	});

	test('LBT_CONFIGS_DIR - Should be .lbt/etc', () => {
		assert.strictEqual(Constants.LBT_CONFIGS_DIR, '.lbt/etc');
	});

	test('SOURCE_FILTER_FOLDER_NAME - Should be .lbt/source-list', () => {
		assert.strictEqual(Constants.SOURCE_FILTER_FOLDER_NAME, '.lbt/source-list');
	});

	test('BUILD_OUTPUT_DIR - Should be .lbt/build-output', () => {
		assert.strictEqual(Constants.BUILD_OUTPUT_DIR, '.lbt/build-output');
	});

	test('BUILD_HISTORY_DIR - Should be .lbt/build-history', () => {
		assert.strictEqual(Constants.BUILD_HISTORY_DIR, '.lbt/build-history');
	});

	test('LBT_APP_CONFIG_FILE - Should be .lbt/etc/app-config.toml', () => {
		assert.strictEqual(Constants.LBT_APP_CONFIG_FILE, '.lbt/etc/app-config.toml');
	});

	test('LBT_APP_CONFIG_USER_FILE - Should be .lbt/etc/.user-app-config.toml', () => {
		assert.strictEqual(Constants.LBT_APP_CONFIG_USER_FILE, '.lbt/etc/.user-app-config.toml');
	});

	test('LBT_SOURCE_CONFIG_FILE - Should be .lbt/etc/source-config.toml', () => {
		assert.strictEqual(Constants.LBT_SOURCE_CONFIG_FILE, '.lbt/etc/source-config.toml');
	});

	test('LBT_LOG_FILE - Should be .lbt/log/main.log', () => {
		assert.strictEqual(Constants.LBT_LOG_FILE, '.lbt/log/main.log');
	});

	test('DEPENDENCY_LIST - Should be .lbt/etc/dependency.json', () => {
		assert.strictEqual(Constants.DEPENDENCY_LIST, '.lbt/etc/dependency.json');
	});

	test('COMPILED_OBJECT_LIST - Should be .lbt/etc/object-builds.json', () => {
		assert.strictEqual(Constants.COMPILED_OBJECT_LIST, '.lbt/etc/object-builds.json');
	});

	test('LBT_BACKEND_VERSION - Should be a number', () => {
		assert.strictEqual(typeof Constants.LBT_BACKEND_VERSION, 'number');
		assert.ok(Constants.LBT_BACKEND_VERSION > 0);
	});

	test('HTML_TEMPLATE_DIR - Should contain path to templates', () => {
		assert.ok(Constants.HTML_TEMPLATE_DIR.includes('templates'));
	});
});
