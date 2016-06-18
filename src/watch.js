import c from './libs/config';
import webpackDevServer from './utils/webpack-dev-server';
import lessTask from './utils/less';
import sassTask from './utils/sass';
import chokidar from 'chokidar';
import logger from './libs/logger';
import path from 'path';

const loadConfig = () => c().load();

async function watch(config = loadConfig()) {
	const tasks = [];
	// add webpack to task. watch and compile js files
	tasks.push(webpackDevServer(config));


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
