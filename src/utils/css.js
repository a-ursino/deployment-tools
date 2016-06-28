import fs from '../libs/fs';
import logger from '../libs/logger';
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
import trimEnd from 'lodash/trimEnd';

// function getJSONFromCssModules(cssFileName, json) {
// 	console.log('getJSONFromCssModules', cssFileName, json);
// 	const cssName = path.basename(cssFileName, '.css');
// 	const jsonFileName = path.resolve('./data/css/', `${cssName}.json`);
// 	fs.writeFileSync(jsonFileName, JSON.stringify(json));
// }

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
		console.log('styledocPath', styledocPath);
		minPlugins.push(mdcss({ destination: styledocPath, assets: [] })); // assets: The list of files or directories to copy into the style guide directory.
	}
	// add css-clean plugin for minify
	minPlugins.push(clean());
	const processedMinCssObject = await postcss(minPlugins).process(compiledCss.css);

	// compute the hash(md5) of the file
	const filehash = crypto.createHash('md5').update(processedMinCssObject.css, 'utf8').digest('hex');
	await fs.writeAsync(`${outputFolder}${filehash}.css`, processedMinCssObject.css);
	// generate map file for min ???
	if (processedMinCssObject.map) await fs.writeAsync(`${outputFolder}${filehash}.css.map`, processedMinCssObject.map);
	return { filename: `${filename}.css`, filehash: `${filehash}.css` };
}

/**
 * Build, lint and minify css.
 * @param {object} [obj] - obj
 * @param {string} obj.srcFolder -
 * @param {string} obj.outputFolder -
 * @param {string} obj.filename -
 * @param {string} obj.cdnDomain -
 * @param {boolean} obj.minify -
 * @param {string} obj.engine -
 * @param {string} obj.projectName -
 * @param {string} obj.ext -
 * @param {string} obj.stylelintrc -
 * @param {string} obj.styledocPath -
 * @param {string} obj.doiuseRules - Browser to check with doiuse
 * @param {string} obj.autoprefixerRules - Browser to autoprefix
 * @return {Promise} A Promise
 */
async function compileStylesheetAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, engine, ext = '.less', stylelintrc, styledocPath, doiuseRules = '', autoprefixerRules = '' }) {
	const filepath = `${srcFolder}${filename}`;
	const filesPath = [];
	// add the folder with the less files
	filesPath.push(path.join(process.cwd(), 'node_modules'));
	filesPath.push(path.join(process.cwd(), srcFolder));
	logger.log(`compile less srcFolder:${srcFolder} outputFolder:${outputFolder} filename:${filename} minify:${minify} path: ${filesPath}`);

	// read less file
	const source = await fs.readFileAsync(filepath);
	// const outputCss = await less.render(lessInput, { paths: filesPath, sourceMap: { sourceMapFileInline: false } });
	// es: main.less-> main
	const cssOutputFileName = path.basename(filename, ext);
	// css/main.css
	const cssOutputPath = `${outputFolder}${cssOutputFileName}.css`;
	const cssMapOutputPath = `${outputFolder}${cssOutputFileName}.css.map`;
	logger.log(`compile stylesheet: write output at cssOutputPath:${cssOutputPath} filename:${filename}`);

	// PLUGINS: prepare plugins for postCss
	const postCssPlugins = [];
	postCssPlugins.push(engine({ strictMath: true, paths: filesPath }));
	// USE stylint ??
	if (stylelintrc) {
		const stylelintrcFile = path.join(process.cwd(), stylelintrc);
		debug(`Enable stylint on file:${filename} with file ${stylelintrcFile}`);
		postCssPlugins.push(stylelint({ configFile: stylelintrcFile }));
	}
	// USE AUTOPREFIXER ??
	const autoprefixerRulesArr = autoprefixerRules.split(',');
	if (autoprefixerRulesArr.length) {
		debug(`Enable autoprefixer on file:${filename} with ${autoprefixerRulesArr}`);
		postCssPlugins.push(autoprefixer({ browsers: autoprefixerRulesArr }));
	}

	// transform image url for CDN
	postCssPlugins.push(url({
		url(imageurl) {
			if (minify) {
				if (!imageurl.startsWith('http')) {
					const newImageUrl = imageurl.startsWith('/') ? `${cdnDomain}/${projectName}${imageurl}` : imageurl;
					debug(`Found an image url original:${imageurl} new:${newImageUrl}`);
					return newImageUrl;
				}
			}
			return imageurl;
		},
	}));

	// CAN I USE ??
	const doiuseRulesArr = doiuseRules.split(',');
	if (doiuseRulesArr.length) {
		debug(`Enable doiuse on file:${filename} with ${doiuseRulesArr}`);
		postCssPlugins.push(doiuse({
			browsers: [],
			ignore: [], // an optional array of features to ignore 'rem'
			ignoreFiles: [path.join(process.cwd(), 'node_modules', `/**/*${ext}`)], // an optional array of file globs to match against original source file path, to ignore
			// onFeatureUsage(usageInfo) {
			// 	logger.warn('CANIUSE', usageInfo.message);
			// },
		}));
	}

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
	const processedCssObject = await cssProcessor.process(source, { parser: engine.parser, from: filepath });

	// write css output on file
	const outputTask = [];

	outputTask.push(fs.writeAsync(cssOutputPath, processedCssObject.css));

	// generate map file for unminified file ???
	if (processedCssObject.map) outputTask.push(fs.writeAsync(cssMapOutputPath, processedCssObject.map));

	// enable minify (and css docs)???
	if (minify) {
		outputTask.push(generateMinifiedAsync({ filename: cssOutputFileName, styledocPath: `${trimEnd(styledocPath, '/')}_${cssOutputFileName}`, outputFolder, compiledCss: processedCssObject }));
	}

	debug(`Running ${outputTask.length} task(s) in parallel`);
	return Promise.all(outputTask);
}

export default compileStylesheetAsync;
