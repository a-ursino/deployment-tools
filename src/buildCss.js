import lessTask from './utils/less';
import sassTask from './utils/sass';
import path from 'path';
import clean from './clean';
import c from './libs/config';
import flattenDeep from 'lodash/flattenDeep';
import compact from 'lodash/compact';
import fs from './libs/fs';

const loadConfig = () => c().load();

/**
 * Build, lint and minify css.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @param {boolean} [obj.cleaned=false] - Already performed the cleaning phase
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run buildCss
 */
async function buildCss({ config = loadConfig(), cleaned = false } = {}) {
	// we must clean??
	if (!cleaned) await clean(config);

	const output = [];
	// if the srcLess is not set -> skip this task
	if (config.get('srcLess')) {
		output.push(...(await lessTask({ config, minify: true })));
	}

	// if the srcSass is not set -> skip this task
	if (config.get('srcSass')) {
		output.push(...(await sassTask({ config, minify: true })));
	}
	const compactOutput = compact(flattenDeep(output));
	// create a hash version of the min files
	// write css stats inside a file
	fs.writeFileSync(path.join(process.cwd(), 'css-assets-stats.json'), JSON.stringify({ assets: compactOutput }));
}

export default buildCss;
