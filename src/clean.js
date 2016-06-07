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
import compact from 'lodash/compact';
import c from './libs/config';
import path from 'path';
const debug = require('debug')('dt');

const loadConfig = () => c().load();

async function clean(config = loadConfig()) {
	// TODO: check if we must delete css folder
	const distFolder = [
		path.join(process.cwd(), config.get('buildPathJs')),
	];
	if (!config.get('preserveBuildPathCss')) {
		distFolder.push(path.join(process.cwd(), config.get('buildPathCss')));
	}
	// compact the array
	const distFolderCompacted = compact(distFolder);
	debug(`try to delete folder(s) ${distFolderCompacted}`);
	await del(distFolderCompacted, { dot: true });
	debug(`deleted folder(s) ${distFolderCompacted}`);
	await fs.makeDirsAsync(distFolderCompacted);
	debug(`created folder(s) ${distFolderCompacted}`);
}

export default clean;
