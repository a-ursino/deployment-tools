import webpackTask from './utils/webpack';
import clean from './clean';
import c from './libs/config';

const loadConfig = () => c().load();

/**
 * Lint, transpile and minify Js files via webpack.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @param {boolean} [obj.cleaned=false] - Already performed the cleaning phase
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run buildImages
 */
async function webpack({ config = loadConfig(), cleaned = false } = {}) {
	// we must clean??
	if (!cleaned) await clean(config);
	await webpackTask(config);
}

export default webpack;
