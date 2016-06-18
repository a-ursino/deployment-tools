import c from '../libs/config';
import logger from '../libs/logger';
import compileStylesheetAsync from './css';
const sass = require('postcss-scss');

const loadConfig = () => c().load();

async function compileSassAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, stylelintrc, styledocPath }) {
	try {
		// if filename is undefined, skip
		if (!filename) return;
		await compileStylesheetAsync({ srcFolder, outputFolder, filename, cdnDomain, minify, projectName, engine: sass, ext: '.sass', stylelintrc, styledocPath });
	} catch (e) {
		logger.error(e);
	}
}

async function sassTaskAsync({ config = loadConfig(), minify = false }) {
	const srcFolder = config.get('srcSass');
	const outputFolder = config.get('buildPathCss');
	// NOTE: use the cdn alias for images
	const cdnDomain = config.get('imagesCdnAlias');
	const projectName = config.get('projectName');
	const version = config.get('version');
	const stylelintrc = config.get('stylelintrc');
	const styledocPath = config.get('styledocPath');
	const tasks = [
		compileSassAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }),
		// the main-backoffice is OPT-IN
		compileSassAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath }),
	];
	await Promise.all(tasks);
}

export default sassTaskAsync;
