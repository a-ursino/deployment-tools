const debug = require('debug')('dt');
const path = require('path');
const postcss = require('postcss');
const postcssDevtools = require('postcss-devtools');
const postcssAtImport = require('postcss-import');
const postcssAutoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const postcssCalc = require('postcss-calc');
const postcssReporter = require('postcss-reporter');
const postcssStylelint = require('stylelint');
const postcssClean = require('postcss-clean');
const mdcss = require('mdcss');
const doiuse = require('doiuse');
const crypto = require('crypto');

const trimEnd = require('lodash/trimEnd');
import fs from '../libs/fs';
import logger from '../libs/logger';

/**
 * Write minified version of the file
 * @param {object} [obj] - obj
 * @param {string} obj.filename -
 * @param {string} obj.styledocPath -
 * @param {string} obj.compiledCss -
 * @param {string} obj.outputFolder -
 * @return {Promise} A Promise
 */
async function generateMinifiedAsync({ filename, styledocPath, compiledCss, outputFolder }) {
	// write in parallel minified version
	logger.log(`minify stylesheet: filename:${filename}`);
	// minify via clean-css
	const minPlugins = [];
	// generate css documentation??
	if (styledocPath) {
		const pathDoc = `${trimEnd(styledocPath, '/')}_${filename}`;
		debug(`[CSS] Generate documentation for ${filename} pathDoc: ${pathDoc}`);
		minPlugins.push(mdcss({ destination: pathDoc, assets: [] })); // assets: The list of files or directories to copy into the style guide directory.
	}
	// add css-clean plugin for minify
	minPlugins.push(postcssClean());
	const processedMinCssObject = await postcss(minPlugins).process(compiledCss.css);

	// compute the hash(md5) of the file
	const filehash = crypto.createHash('md5').update(processedMinCssObject.css, 'utf8').digest('hex');
	await fs.writeAsync(`${outputFolder}${filename}.${filehash}.css`, processedMinCssObject.css);
	// generate map file for min ???
	if (processedMinCssObject.map) await fs.writeAsync(`${outputFolder}${filehash}.css.map`, processedMinCssObject.map);
	return { filename: `${filename}.css`, filehash: `${filehash}.css` };
}

/**
 * Build, lint and minify css.
 * @param {object} [obj] - obj
 * @param {string} obj.srcFolder - The folder that contains the file
 * @param {string} obj.filename - The name of the file (main.less/main.sass)
 * @param {string} obj.outputFolder - The output folder
 * @param {string} obj.cdnDomain - The domain (with http://) of the CDN for images
 * @param {boolean} obj.minify=false - Compile a minified version of the file
 * @param {string} obj.engine - Which engine to use less/sass
 * @param {string} obj.projectName - The name of the project
 * @param {string} [obj.stylelintrc] - Relative path of the configuration file for stylelint
 * @param {string} obj.styledocPath - Relative path for the documentation output
 * @param {string} obj.doiuseRules='' - Browser to check with doiuse
 * @param {string} obj.autoprefixerRules='' - Browser to autoprefix
 * @return {Promise} A Promise
 */
async function compileStylesheetAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, engine, stylelintrc, styledocPath, doiuseRules = '', autoprefixerRules = '' }) {
	const filepath = `${srcFolder}${filename}`;
	const filesPath = [];
	// add the folder with the less files
	filesPath.push(path.join(process.cwd(), 'node_modules'));
	filesPath.push(path.join(process.cwd(), srcFolder));
	logger.log(`compile less srcFolder:${srcFolder} outputFolder:${outputFolder} filename:${filename} minify:${minify} path: ${filesPath}`);

	// read less/sass file
	const source = await fs.readFileAsync(filepath);
	const ext = path.extname(filename);
	// es: main.less-> main
	const cssOutputFileName = path.basename(filename, ext);
	// css/main.css
	const cssOutputPath = `${outputFolder}${cssOutputFileName}.css`;
	const cssMapOutputPath = `${outputFolder}${cssOutputFileName}.css.map`;
	logger.log(`compile stylesheet: write output at cssOutputPath:${cssOutputPath} filename:${filename}`);

	// PLUGINS: prepare plugins for postCss
	const postCssPlugins = [];
	postCssPlugins.push(postcssDevtools());
	postCssPlugins.push(engine({ strictMath: true, paths: filesPath }));
	postCssPlugins.push(postcssAtImport({ path: ['data/less'] }));

	// USE stylint ??
	if (stylelintrc) {
		const stylelintrcFile = path.join(process.cwd(), stylelintrc);
		debug(`[CSS] Enable stylint on file:${filename} with file ${stylelintrcFile} and cwd ${process.cwd()}`);
		postCssPlugins.push(postcssStylelint({ configFile: stylelintrcFile }));
	}
	// USE AUTOPREFIXER ??
	const autoprefixerRulesArr = autoprefixerRules.split(',');
	if (autoprefixerRulesArr.length) {
		debug(`[CSS] Enable autoprefixer on file:${filename} with ${autoprefixerRulesArr}`);
		postCssPlugins.push(postcssAutoprefixer({ browsers: autoprefixerRulesArr }));
	}

	// transform image url for CDN
	postCssPlugins.push(postcssUrl({
		url(imageurl) {
			if (minify) {
				if (!imageurl.startsWith('http')) {
					const newImageUrl = imageurl.startsWith('/') ? `${cdnDomain}/${projectName}${imageurl}` : imageurl;
					debug(`[CSS] Found inside ${filename} an image url original:${imageurl} new:${newImageUrl}`);
					return newImageUrl;
				}
			}
			return imageurl;
		},
	}));

	// CAN I USE ??
	const doiuseRulesArr = doiuseRules.split(',');
	if (doiuseRulesArr.length) {
		debug(`[CSS] Enable doiuse on file:${filename} with ${doiuseRulesArr}`);
		postCssPlugins.push(doiuse({
			browsers: [],
			ignore: [], // an optional array of features to ignore 'rem'
			ignoreFiles: [path.join(process.cwd(), 'node_modules', `/**/*${ext}`)], // an optional array of file globs to match against original source file path, to ignore
			// onFeatureUsage(usageInfo) {
			// 	logger.warn('CANIUSE', usageInfo.message);
			// },
		}));
	}
	// use calc
	postCssPlugins.push(postcssCalc());

	postCssPlugins.push(postcssReporter({ clearMessages: true })); // clearMessages if true, the plugin will clear the result's messages after it logs them

	// Use Css Module
	// postCssPlugins.push(cssmodules({
	// 	scopeBehaviour: 'global', // can be 'global' or 'local',
	// 	// generateScopedName: '[name]__[local]___[hash:base64:5]',
	// 	getJSON: getJSONFromCssModules,
	// }));

	// postcss(plugins)  list of PostCSS plugins to be included as processors.
	const cssProcessor = postcss(postCssPlugins);

	// process less file
	debug(`[CSS] Compiling stylesheet file:${filename}`);
	const processedCssObject = await cssProcessor.process(source, { parser: engine.parser, from: filepath });
	debug(`[CSS] Compiled stylesheet file:${filename}`);

	// write css output on file
	const outputTask = [];

	outputTask.push(fs.writeAsync(cssOutputPath, processedCssObject.css));

	// generate map file for unminified file ???
	if (processedCssObject.map) outputTask.push(fs.writeAsync(cssMapOutputPath, processedCssObject.map));

	// enable minify (and css docs)???
	if (minify) {
		outputTask.push(generateMinifiedAsync({ filename: cssOutputFileName, styledocPath, outputFolder, compiledCss: processedCssObject }));
	}

	debug(`[CSS] Running ${outputTask.length} task(s) in parallel`);
	return Promise.all(outputTask);
}

export default compileStylesheetAsync;
