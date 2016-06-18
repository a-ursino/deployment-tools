'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = require('../libs/config');

var _config2 = _interopRequireDefault(_config);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const less = require('postcss-less-engine');

const loadConfig = () => (0, _config2.default)().load();

function compileLessAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, stylelintrc, styledocPath }) {
	// if filename is undefined, skip
	if (!filename) return -1;
	return (0, _css2.default)({ srcFolder, outputFolder, filename, cdnDomain, minify, projectName, engine: less, stylelintrc, styledocPath });
}

function lessTaskAsync({ config = loadConfig(), minify = false }) {
	const srcFolder = config.get('srcLess');
	const outputFolder = config.get('buildPathCss');
	// NOTE: use the cdn alias for images
	const cdnDomain = config.get('imagesCdnAlias');
	const projectName = config.get('projectName');
	const version = config.get('version');
	const stylelintrc = config.get('stylelintrc');
	const styledocPath = config.get('styledocPath');
	const tasks = [compileLessAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath })];
	// the main-backoffice is OPT-IN
	if (config.get('mainBackoffileStyle')) {
		tasks.push(compileLessAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }));
	}
	return Promise.all(tasks);
}

exports.default = lessTaskAsync;