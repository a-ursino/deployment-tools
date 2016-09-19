import path from 'path';
import chokidar from 'chokidar';
import c from './libs/config';
import webpackDevServer from './utils/webpack-dev-server';
import lessTask from './utils/less';
import sassTask from './utils/sass';
import logger from './libs/logger';
import clean from './clean';

const loadConfig = () => c().load();

/**
 * Watch JavaScript (via webpack), less/sass folder.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 */
async function watch({ config = loadConfig() } = {}) {
	// clean folder
	await clean({ config });
	const tasks = [];
	// add webpack to task. watch and compile js files
	tasks.push(webpackDevServer({ config }));

	// watch less files???
	if (config.get('srcLess')) {
		// compile less files for the first time
		tasks.push(lessTask(config, false));
		const watchFiles = path.join(process.cwd(), config.get('srcLess'));
		chokidar.watch(watchFiles).on('change', (filepath) => {
			logger.log(`${filepath} less file changed`);
			lessTask(config);
		});
	}
	// watch sass files???
	if (config.get('srcSass')) {
		// compile sass files for the first time
		tasks.push(sassTask(config, false));
		const watchFiles = path.join(process.cwd(), config.get('srcSass'));
		chokidar.watch(watchFiles).on('change', (filepath) => {
			logger.log(`${filepath} sass file changed`);
			sassTask(config);
		});
	}

	await Promise.all(tasks);
}

export default watch;
