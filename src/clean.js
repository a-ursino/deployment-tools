/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import del from 'del';
import fs from './libs/fs';
import trimEnd from 'lodash/trimEnd';
import c from './libs/config';
import path from 'path';
const debug = require('debug')('dt');

const loadConfig = () => c().load();

async function clean(config = loadConfig()) {
	const distFolder = [];
	// delete js build folder?
	if (config.get('buildPathJs')) {
		distFolder.push(path.join(process.cwd(), config.get('buildPathJs')));
	}

	// delete css build folder?
	if (!config.get('preserveBuildPathCss')) {
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
