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

function lessTaskAsync({ config = loadConfig(), minify = false } = {}) {
	const srcFolder = config.get('srcLess');
	const outputFolder = config.get('buildPathCss');
	// NOTE: use the cdn alias for images
	const cdnDomain = config.get('cdnImagesAlias');
	const projectName = config.get('projectName');
	const version = config.get('version');
	const stylelintrc = config.get('stylelintrc');
	const styledocPath = config.get('styledocPath');
	const mainStyle = config.get('mainStyle');
	const mainBackoffileStyle = config.get('mainBackoffileStyle');
	const doiuseRules = config.get('doiuse');
	const autoprefixerRules = config.get('autoprefixer');
	const tasks = [(0, _css2.default)({ filename: mainStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules, engine: less })];

	// the main-backoffice is OPT-IN
	if (mainBackoffileStyle) {
		tasks.push((0, _css2.default)({ filename: mainBackoffileStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules, engine: less }));
	}
	return Promise.all(tasks);
}

exports.default = lessTaskAsync;