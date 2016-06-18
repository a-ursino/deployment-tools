'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let compileSassAsync = (() => {
	var ref = _asyncToGenerator(function* ({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, stylelintrc, styledocPath }) {
		try {
			// if filename is undefined, skip
			if (!filename) return;
			yield (0, _css2.default)({ srcFolder, outputFolder, filename, cdnDomain, minify, projectName, engine: sass, ext: '.sass', stylelintrc, styledocPath });
		} catch (e) {
			_logger2.default.error(e);
		}
	});

	return function compileSassAsync(_x) {
		return ref.apply(this, arguments);
	};
})();

let sassTaskAsync = (() => {
	var ref = _asyncToGenerator(function* ({ config = loadConfig(), minify = false }) {
		const srcFolder = config.get('srcSass');
		const outputFolder = config.get('buildPathCss');
		// NOTE: use the cdn alias for images
		const cdnDomain = config.get('imagesCdnAlias');
		const projectName = config.get('projectName');
		const version = config.get('version');
		const stylelintrc = config.get('stylelintrc');
		const styledocPath = config.get('styledocPath');
		const tasks = [compileSassAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }),
		// the main-backoffice is OPT-IN
		compileSassAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath })];
		yield Promise.all(tasks);
	});

	return function sassTaskAsync(_x2) {
		return ref.apply(this, arguments);
	};
})();

var _config = require('../libs/config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const sass = require('postcss-scss');

const loadConfig = () => (0, _config2.default)().load();

exports.default = sassTaskAsync;