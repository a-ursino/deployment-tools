import path from 'path';
const debug = require('debug')('dt');

function getWebpackConfig(config, dev = false) {
	// the webpack files must be in the JavaScript folder
	const file = dev ? 'webpack.dev.config.js' : 'webpack.build.config.js';
	const filePath = path.join(process.cwd(), `${config.get('srcJsPath')}${file}`);
	debug(`load Webpack file ${filePath} dev:${dev} cwd:${process.cwd()}`);
	const webpackConfigFile = require(filePath); // eslint-disable-line global-require

	const webpackConfig = Object.assign({}, webpackConfigFile);
	// Override some values at run-time
	// output path
	// es: s
	webpackConfig.output.path = path.join(process.cwd(), config.get('buildPathJs'));
	debug(`webpackConfig.output.path ${webpackConfig.output.path}`);
	// publicPath for CDN
	// {domain}/{projectName}/{version}/{buildPathJs}
	// es: http://az889637.vo.msecnd.net/projectName/2.9.0/bundles/
	webpackConfig.output.publicPath = `${config.get('domain')}/${config.get('projectName')}/${config.get('version')}/${config.get('buildPathJs')}`;
	debug(`webpackConfig.output.publicPath ${webpackConfig.output.publicPath}`);

	// main entry
	// .{srcJsPath}{mainJs}
	// es: ./data/scripts/main.js
	webpackConfig.entry.main = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('mainJs')}`);
	debug(`webpackConfig.entry.main ${webpackConfig.entry.main}`);

	// main vendors [OPT-IN]
	// .{srcJsPath}{vendorsJs}
	// es: ./data/scripts/vendors.js
	if (config.get('vendorsJs') !== undefined) {
		webpackConfig.entry.vendors = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('vendorsJs')}`);
		debug(`webpackConfig.entry.main-backoffice ${webpackConfig.entry['main-backoffice']}`);
	}
	// main backoffice [OPT-IN]
	// .{srcJsPath}{mainBackoffileJs}
	// es: ./data/scripts/main-backoffice.js
	if (config.get('mainBackoffileJs') !== undefined) {
		webpackConfig.entry['main-backoffice'] = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('mainBackoffileJs')}`);
		debug(`webpackConfig.entry.main-backoffice ${webpackConfig.entry['main-backoffice']}`);
	}
	// vendors backoffice [OPT-IN]
	// .{srcJsPath}{vendorsBackoffileJs}
	// es: ./data/scripts/vendors-backoffice.js
	if (config.get('vendorsBackoffileJs') !== undefined) {
		webpackConfig.entry.vendors = path.join(process.cwd(), `${config.get('srcJsPath')}${config.get('vendorsBackoffileJs')}`);
		debug(`webpackConfig.entry.main-backoffice ${webpackConfig.entry['main-backoffice']}`);
	}
	return webpackConfig;
}

export default getWebpackConfig;
