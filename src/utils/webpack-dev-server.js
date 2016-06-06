import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from './webpack-helper';
// import logger from '../libs/logger';
// import { promisify } from 'bluebird';
import c from '../libs/config';
const debug = require('debug')('dt');
const loadConfig = () => c().load();


async function wp(config = loadConfig()) {
	debug('load the webpack settings');
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
