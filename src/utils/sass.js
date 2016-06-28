import c from '../libs/config';
import compileStylesheetAsync from './css';
const sass = require('postcss-scss');

const loadConfig = () => c().load();

function compileSassAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName, stylelintrc, styledocPath, doiuseRules, autoprefixerRules }) {
	// if filename is undefined, skip
	if (!filename) return -1;
	return compileStylesheetAsync({ srcFolder, outputFolder, filename, cdnDomain, minify, projectName, engine: sass, ext: '.sass', stylelintrc, styledocPath, doiuseRules, autoprefixerRules });
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
	const mainStyle = config.get('mainStyle');
	const mainBackoffileStyle = config.get('mainBackoffileStyle');
	const doiuseRules = config.get('doiuse');
	const autoprefixerRules = config.get('autoprefixer');
	const tasks = [
		compileSassAsync({ filename: mainStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules }),
		// the main-backoffice is OPT-IN
		compileSassAsync({ filename: mainBackoffileStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules }),
	];
	await Promise.all(tasks);
}

export default sassTaskAsync;
