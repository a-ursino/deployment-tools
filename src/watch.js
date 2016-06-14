import c from './libs/config';
import webpackDevServer from './utils/webpack-dev-server';
import lessTask from './utils/less';
import chokidar from 'chokidar';
import logger from './libs/logger';
import path from 'path';

const loadConfig = () => c().load();

async function watch(config = loadConfig()) {
	const tasks = [];
	// compile less the first time
	tasks.push(lessTask(config));
	const watchLess = path.join(process.cwd(), config.get('srcLess'));
	chokidar.watch(watchLess).on('change', (filepath) => {
		logger.log(`${filepath} changed`);
		lessTask(config);
	});
	// add webpack to task. watch and compile js files
	tasks.push(webpackDevServer(config));
	await Promise.all(tasks);
}

export default watch;
