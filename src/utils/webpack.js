import webpack from 'webpack';
import logger from '../libs/logger';
import c from '../libs/config';
import getWebpackConfig from './webpack-helper';
const debug = require('debug')('dt');
const loadConfig = () => c().load();

// --progress --colors -p
async function wp(config = loadConfig()) {
	debug('load the webpack settings');
	const webpackConfig = getWebpackConfig(config);

	return new Promise((resolve, reject) => {
		webpack(webpackConfig).run((err, stats) => {
			// only after all files was compiled
			if (err) {
				return reject(err);
			}
			logger.log(stats.toString({ // eslint-disable-line no-console
				source: true,
				reasons: false,
				chunks: false,
			}));
			return resolve();
		});
	});
}

export default wp;
