import path from 'path';
const debug = require('debug')('dt');

function getWebpackConfig(config, dev = false) {
	// the webpack files must be in the JavaScript folder
	const file = dev ? 'webpack.dev.config.js' : 'webpack.build.config.js';
	const filePath = path.join(process.cwd(), `${config.get('srcJsPath')}${file}`);
	debug(`[WEBPACK-HELPER] load Webpack file ${filePath} dev:${dev} cwd:${process.cwd()}`);
	const webpackConfigFile = require(filePath); // eslint-disable-line global-require

	const webpackConfig = Object.assign({}, webpackConfigFile);
	// Override some values at run-time
	// output path
	webpackConfig.output.path = path.join(process.cwd(), config.get('buildPathJs'));
	debug(`[WEBPACK-HELPER] webpackConfig.output.path ${webpackConfig.output.path}`);
	// publicPath for CDN or webpack dev server (in dev mode)
	// {domain}/{projectName}/{version}/{buildPathJs}
	// es: http://az889637.vo.msecnd.net/projectName/2.9.0/bundles/
	if (dev) {
		// serve js files from webpack dev server on...
		webpackConfig.output.publicPath = 'http://localhost:8080/';
	} else {
		// serve js files from CDN
		webpackConfig.output.publicPath = `${config.get('cdn')}/${config.get('projectName')}${config.get('buildPathJs')}`;
	}
	debug(`[WEBPACK-HELPER] webpackConfig.output.publicPath ${webpackConfig.output.publicPath}`);

	// main entry
	// .{srcJsPath}{mainJs}
	// es: ./data/scripts/main.js
	webpackConfig.entry.main = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('mainJs')}`);
	debug(`[WEBPACK-HELPER] webpackConfig.entry.main ${webpackConfig.entry.main}`);

	// main vendors [OPT-IN]
	// .{srcJsPath}{vendorsJs}
	// es: ./data/scripts/vendors.js
	if (config.get('vendorsJs') !== undefined) {
		webpackConfig.entry.vendors = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('vendorsJs')}`);
		debug(`[WEBPACK-HELPER] webpackConfig.entry.vendors ${webpackConfig.entry.vendors}`);
	}
	// main backoffice [OPT-IN]
	// .{srcJsPath}{mainBackoffileJs}
	// es: ./data/scripts/main-backoffice.js
	if (config.get('mainBackoffileJs') !== undefined) {
		webpackConfig.entry['main-backoffice'] = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('mainBackoffileJs')}`);
		debug(`[WEBPACK-HELPER] webpackConfig.entry.main-backoffice ${webpackConfig.entry['main-backoffice']}`);
	}
	// vendors backoffice [OPT-IN]
	// .{srcJsPath}{vendorsBackoffileJs}
	// es: ./data/scripts/vendors-backoffice.js
	if (config.get('vendorsBackoffileJs') !== undefined) {
		webpackConfig.entry['vendors-backoffice'] = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('vendorsBackoffileJs')}`);
		debug(`[WEBPACK-HELPER] webpackConfig.entry.vendors-backoffice ${webpackConfig.entry['vendors-backoffice']}`);
	}
	return webpackConfig;
}

export default getWebpackConfig;
