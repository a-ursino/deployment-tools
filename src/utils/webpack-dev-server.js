import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from './webpack-helper';
import c from '../libs/config';
import logger from '../libs/logger';

const loadConfig = () => c().load();

/**
 * Start Webpack Dev Server
 * @param {object} [obj] - obj
 * @param {boolean} [obj.config=loadConfig()] - The config object
 * @return {Promise} A Promise
 */
async function wp({ config = loadConfig() } = {}) {
	const webpackConfig = getWebpackConfig(config, true);
	const webpackDevServerHost = !config.get('webpackDevServerHost') ? 'localhost' : config.get('webpackDevServerHost');
	const webpackDevServerPath = !config.get('webpackDevServerPath') ? 'data' : config.get('webpackDevServerPath');
	const webpackDevServerPort = !config.get('webpackDevServerPort') ? 8080 : config.get('webpackDevServerPort');

	// Start webpack-dev-server
	const server = new WebpackDevServer(webpack(webpackConfig), {
		hot: true, //  adds the HotModuleReplacementPlugin and switch the server to hot mode.
		contentBase: webpackDevServerPath, // Directory of the files
		progress: true,
		// webpack-dev-middleware options
		stats: { colors: true },
		quiet: false,
		colors: true,
		noColors: false,
		noInfo: false,
	});
	return new Promise((resolve, reject) => {
		server.listen(webpackDevServerPort, webpackDevServerHost, (err) => {
			if (err) {
				logger.error('ERROR while starting Webpack Dev Server', err);
				return reject(err);
			}
			logger.log('Webpack Dev Server started at', `http://${webpackDevServerHost}:${webpackDevServerPort}`, 'with path:', webpackDevServerPath);
			return resolve();
		});
	});
}


export default wp;
