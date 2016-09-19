/* eslint-disable require-yield */
import webpack from 'webpack';
import path from 'path';
import fs from '../libs/fs';
import logger from '../libs/logger';
import c from '../libs/config';
import getWebpackConfig from './webpack-helper';

const loadConfig = () => c().load();

/**
 * Compile JavaScript files with webpack
 * @param {object} [obj] - obj
 * @param {boolean} [obj.config=loadConfig()] - The config object
 * @return {Promise} A Promise
 */
async function wp({ config = loadConfig() } = {}) {
	// skip webpack task if srcJsPath was not set
	if (!config.get('srcJsPath')) {
		return undefined;
	}
	const webpackConfig = getWebpackConfig(config);
	return new Promise((resolve, reject) => {
		const compiler = webpack(webpackConfig);
		compiler.run((err, stats) => {
			// only after all files was compiled
			if (err) {
				return reject(err);
			}
			logger.log('Webpack stats', stats.toString({
				source: true,
				reasons: false,
				chunks: false,
			}));
			fs.writeFileSync(path.join(process.cwd(), 'wp-assets-stats.json'), JSON.stringify(stats.toJson({ chunks: false, children: false, modules: false })));
			return resolve();
		});
	});
}

export default wp;
