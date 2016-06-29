import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from './webpack-helper';
import c from '../libs/config';

const loadConfig = () => c().load();

/**
 * Start Webpack Dev Server
 * @param {object} [obj] - obj
 * @param {boolean} [obj.config=loadConfig()] - The config object
 * @return {Promise} A Promise
 */
async function wp({ config = loadConfig() } = {}) {
	const webpackConfig = getWebpackConfig(config, true);
	// Start webpack-dev-server
	const server = new WebpackDevServer(webpack(webpackConfig), {
		hot: true, //  adds the HotModuleReplacementPlugin and switch the server to hot mode.
		contentBase: 'data', // Directory of index.html
		progress: true,
		// webpack-dev-middleware options
		stats: { colors: true },
		quiet: false,
		colors: true,
		noColors: false,
		noInfo: false,
	});
	return new Promise((resolve, reject) => {
		server.listen(8080, 'localhost', (err) => {
			if (err) return reject(err);
			return resolve();
		});
	});
}


export default wp;
