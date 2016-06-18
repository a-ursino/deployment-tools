import c from '../libs/config';
import compileStylesheetAsync from './css';
const less = require('postcss-less-engine');

const loadConfig = () => c().load();

function compileLessAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, stylelintrc, styledocPath }) {
	// if filename is undefined, skip
	if (!filename) return -1;
	return compileStylesheetAsync({ srcFolder, outputFolder, filename, cdnDomain, minify, projectName, engine: less, stylelintrc, styledocPath });
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
	const tasks = [
		compileLessAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }),
	];
	// the main-backoffice is OPT-IN
	if (config.get('mainBackoffileStyle')) {
		tasks.push(compileLessAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }));
	}
	return Promise.all(tasks);
}

export default lessTaskAsync;
