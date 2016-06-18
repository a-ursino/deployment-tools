import del from 'del';
import fs from './libs/fs';
import trimEnd from 'lodash/trimEnd';
import c from './libs/config';
import path from 'path';
const debug = require('debug')('dt');

const loadConfig = () => c().load();

/**
 * Delete and recreate folders
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 */
async function clean({ config = loadConfig() } = {}) {
	const distFolder = [];
	// delete js build folder?
	if (config.get('buildPathJs')) {
		distFolder.push(path.join(process.cwd(), config.get('buildPathJs')));
	}

	// delete css build folder?
	if (!config.get('preserveBuildPathCss') && config.get('buildPathCss')) {
		distFolder.push(path.join(process.cwd(), config.get('buildPathCss')));
	}

	// delete image build folder?
	if (config.get('imagesPath')) {
		distFolder.push(path.join(process.cwd(), `${trimEnd(config.get('imagesPath'), '/')}-temp`));
	}

	debug(`try to delete folder(s) ${distFolder}`);
	await del(distFolder, { dot: true, force: true });
	debug(`deleted folder(s) ${distFolder}`);
	await fs.makeDirsAsync(distFolder);
	debug(`created folder(s) ${distFolder}`);
}

export default clean;
