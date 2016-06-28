import fs from '../libs/fs';
import webpack from 'webpack';
// import { promisify } from 'bluebird';
import logger from '../libs/logger';
import c from '../libs/config';
import path from 'path';
import getWebpackConfig from './webpack-helper';
const debug = require('debug')('dt');
const loadConfig = () => c().load();

// const webpackAsync = promisify(webpack);

// --progress --colors -p
async function wp(config = loadConfig()) {
	// skip webpack task if srcJsPath was not set
	if (!config.get('srcJsPath')) {
		return undefined;
	}
	debug('load the webpack settings');
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
