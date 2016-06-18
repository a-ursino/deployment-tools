'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


// function getJSONFromCssModules(cssFileName, json) {
// 	console.log('getJSONFromCssModules', cssFileName, json);
// 	const cssName = path.basename(cssFileName, '.css');
// 	const jsonFileName = path.resolve('./data/css/', `${cssName}.json`);
// 	fs.writeFileSync(jsonFileName, JSON.stringify(json));
// }

let generateMinifiedAsync = (() => {
	var ref = _asyncToGenerator(function* ({ filename, styledocPath, compiledCss, outputFolder }) {
		// write in parallel minified version
		_logger2.default.log(`minify stylesheet: filename:${ filename }`);
		// minify via clean-css
		const minPlugins = [];
		// generate css documentation??
		if (styledocPath) {
			console.log('styledocPath', styledocPath);
			minPlugins.push(mdcss({ destination: styledocPath, assets: [] })); // assets: The list of files or directories to copy into the style guide directory.
		}
		// add css-clean plugin for minify
		minPlugins.push(clean());
		const processedMinCssObject = yield postcss(minPlugins).process(compiledCss.css);

		// compute the hash(md5) of the file
		const filehash = crypto.createHash('md5').update(processedMinCssObject.css, 'utf8').digest('hex');
		yield _fs2.default.writeAsync(`${ outputFolder }${ filehash }.css`, processedMinCssObject.css);
		// generate map file for min ???
		if (processedMinCssObject.map) yield _fs2.default.writeAsync(`${ outputFolder }${ filehash }.css.map`, processedMinCssObject.map);
		return { filename: `${ filename }.css`, filehash: `${ filehash }.css` };
	});

	return function generateMinifiedAsync(_x) {
		return ref.apply(this, arguments);
	};
})();

let compileStylesheetAsync = (() => {
	var ref = _asyncToGenerator(function* ({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, engine, ext = '.less', stylelintrc, styledocPath }) {
		const filepath = `${ srcFolder }${ filename }`;
		const filesPath = [];
		// add the folder with the less files
		filesPath.push(path.join(process.cwd(), 'node_modules'));
		filesPath.push(path.join(process.cwd(), srcFolder));
		_logger2.default.log(`compile less srcFolder:${ srcFolder } outputFolder:${ outputFolder } filename:${ filename } minify:${ minify } path: ${ filesPath }`);

		// read less file
		const source = yield _fs2.default.readFileAsync(filepath);
		// const outputCss = await less.render(lessInput, { paths: filesPath, sourceMap: { sourceMapFileInline: false } });
		// es: main.less-> main
		const cssOutputFileName = path.basename(filename, ext);
		// css/main.css
		const cssOutputPath = `${ outputFolder }${ cssOutputFileName }.css`;
		const cssMapOutputPath = `${ outputFolder }${ cssOutputFileName }.css.map`;
		_logger2.default.log(`compile stylesheet: write output at cssOutputPath:${ cssOutputPath } filename:${ filename }`);

		// PLUGINS: prepare plugins for postCss
		const postCssPlugins = [];
		postCssPlugins.push(engine({ strictMath: true, paths: filesPath }));
		// NOTE: stylelint is OPT-IN
		// if (stylelintrc) {
		// 	const stylelintrcFile = path.join(process.cwd(), stylelintrc);
		// 	debug(`Enable stylint with file ${stylelintrcFile}`);
		// 	postCssPlugins.push(stylelint({ configFile: stylelintrcFile }));
		// }
		postCssPlugins.push(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }));
		// transform image url for CDN
		postCssPlugins.push(url({
			url(imageurl) {
				if (minify) {
					if (!imageurl.startsWith('http')) {
						const newImageUrl = imageurl.startsWith('/') ? `${ cdnDomain }/${ projectName }${ imageurl }` : imageurl;
						debug(`Found an image url original:${ imageurl } new:${ newImageUrl }`);
						return newImageUrl;
					}
				}
				return imageurl;
			}
		}));

		// CAN I USE
		postCssPlugins.push(doiuse({
			browsers: ['ie >= 9', '> 1%'],
			ignore: [], // an optional array of features to ignore 'rem'
			ignoreFiles: [path.join(process.cwd(), 'node_modules', `/**/*${ ext }`)] }));

		// an optional array of file globs to match against original source file path, to ignore
		// onFeatureUsage(usageInfo) {
		// 	logger.warn('CANIUSE', usageInfo.message);
		// },
		postCssPlugins.push(reporter({ clearMessages: true })); // clearMessages if true, the plugin will clear the result's messages after it logs them

		// Use Css Module
		// postCssPlugins.push(cssmodules({
		// 	scopeBehaviour: 'global', // can be 'global' or 'local',
		// 	// generateScopedName: '[name]__[local]___[hash:base64:5]',
		// 	getJSON: getJSONFromCssModules,
		// }));

		// postcss(plugins)  list of PostCSS plugins to be included as processors.
		const cssProcessor = postcss(postCssPlugins);

		// process less file
		const processedCssObject = yield cssProcessor.process(source, { parser: engine.parser, from: filepath });

		// write css output on file
		const outputTask = [];

		outputTask.push(_fs2.default.writeAsync(cssOutputPath, processedCssObject.css));

		// generate map file for unminified file ???
		if (processedCssObject.map) outputTask.push(_fs2.default.writeAsync(cssMapOutputPath, processedCssObject.map));

		// enable minify (and css docs)???
		if (minify) {
			outputTask.push(generateMinifiedAsync({ filename: cssOutputFileName, styledocPath: `${ (0, _trimEnd2.default)(styledocPath, '/') }_${ cssOutputFileName }`, outputFolder, compiledCss: processedCssObject }));
		}

		debug(`Running ${ outputTask.length } task(s) in parallel`);
		return Promise.all(outputTask);
	});

	return function compileStylesheetAsync(_x2) {
		return ref.apply(this, arguments);
	};
})();

var _fs = require('../libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _logger = require('../libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _trimEnd = require('lodash/trimEnd');

var _trimEnd2 = _interopRequireDefault(_trimEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('dt');
const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const reporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const clean = require('postcss-clean');
const doiuse = require('doiuse');
const crypto = require('crypto');
const mdcss = require('mdcss');


const AUTOPREFIXER_BROWSERS = ['Android 2.3', 'Android >= 4', 'Chrome >= 35', 'Firefox >= 31', 'Explorer >= 9', 'iOS >= 7', 'Opera >= 12', 'Safari >= 7.1'];exports.default = compileStylesheetAsync;