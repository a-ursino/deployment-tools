import c from '../libs/config';
import compileStylesheetAsync from './css';

const less = require('postcss-less-engine');

const loadConfig = () => c().load();

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
	const tasks = [
		compileStylesheetAsync({ filename: mainStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules, engine: less }),
	];

	// the main-backoffice is OPT-IN
	if (mainBackoffileStyle) {
		tasks.push(compileStylesheetAsync({ filename: mainBackoffileStyle, srcFolder, outputFolder, cdnDomain, minify, projectName, version, stylelintrc, styledocPath, doiuseRules, autoprefixerRules, engine: less }));
	}
	return Promise.all(tasks);
}

export default lessTaskAsync;
