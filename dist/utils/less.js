'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let compileLessAsync = (() => {
	var ref = _asyncToGenerator(function* ({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, version }) {
		// if filename is undefined, skip
		if (filename === undefined) return;
		const filepath = `${ srcFolder }${ filename }`;
		const lessPath = [];
		// add the folder with the less files
		lessPath.push(_path2.default.join(process.cwd(), 'node_modules'));
		lessPath.push(_path2.default.join(process.cwd(), srcFolder));
		_logger2.default.log(`compile less srcFolder:${ srcFolder } outputFolder:${ outputFolder } filename:${ filename } minify:${ minify } path: ${ lessPath }`);
		const lessInput = yield _fs2.default.readFileAsync(filepath);
		const outputCss = yield _less2.default.render(lessInput, { paths: lessPath, sourceMap: { sourceMapFileInline: false } });
		// es: main.less-> main
		const cssOutputFileName = filename.replace('.less', '');
		// css/main.css
		const cssOutputPath = `${ outputFolder }${ cssOutputFileName }.css`;
		// const cssMapOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
		const cssMinOutputPath = `${ outputFolder }${ cssOutputFileName }.min.css`;
		// const cssMinOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
		const cssProcessor = (0, _postcss2.default)([(0, _autoprefixer2.default)()]).use((0, _postcssUrl2.default)({
			// transform image url for CDN
			url(imageurl) {
				if (minify) {
					return `${ cdnDomain }/${ projectName }/${ version }${ outputFolder.substring(0, outputFolder.length - 1) }${ imageurl }`;
				}
				return imageurl;
			}
		}));
		const processedCssObject = yield cssProcessor.process(outputCss.css);
		const outputTask = [_fs2.default.writeFileAsync(cssOutputPath, processedCssObject.css)];
		// enable minify???
		if (minify) {
			const nano = (0, _cssnano2.default)({ discardComments: { removeAll: true } });
			// make minify via Css-Nano
			const processedMinCssObject = yield cssProcessor.use(nano).process(processedCssObject.css);
			outputTask.push(_fs2.default.writeFileAsync(cssMinOutputPath, processedMinCssObject.css));
		}

		yield Promise.all(outputTask);
	});

	return function compileLessAsync(_x) {
		return ref.apply(this, arguments);
	};
})();

// cross-env NODE_ENV=production lessc --include-path=node_modules ./less/main.less ./css/main.min.css --clean-css=\"--s1 --advanced --compatibility=ie8\"


let lessTaskAsync = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig(), minify = false) {
		// if the srcLess is not set -> skip this task
		if (config.get('srcLess') === undefined) return;
		const srcFolder = config.get('srcLess');
		const outputFolder = config.get('buildPathCss');
		const cdnDomain = config.get('domain');
		const projectName = config.get('projectName');
		const version = config.get('version');
		const tasks = [compileLessAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version }),
		// the main-backoffice is OPT-IN
		compileLessAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version })];
		yield Promise.all(tasks);
	});

	return function lessTaskAsync(_x2, _x3) {
		return ref.apply(this, arguments);
	};
})();

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _fs = require('../libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _config = require('../libs/config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cssnano = require('cssnano');

var _cssnano2 = _interopRequireDefault(_cssnano);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _postcssUrl = require('postcss-url');

var _postcssUrl2 = _interopRequireDefault(_postcssUrl);

var _logger = require('../libs/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// const debug = require('debug')('dt');
const loadConfig = () => (0, _config2.default)().load();

exports.default = lessTaskAsync;