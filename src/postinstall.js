/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import ncp from 'ncp';
import del from 'del';
import path from 'path';
import logger from './libs/logger';
import { promisify } from 'bluebird';

async function postinstall() {
	const ncpAsync = promisify(ncp);
	// this is the path of the package: ..../node_modules/deployment-tools
	const packagePath = process.cwd();
	const src = path.join(packagePath, 'dist');
	const projectPath = path.join(packagePath, '../../');
	const destPath = path.join(projectPath, 'tools');
	logger.log('postinstall try to copy files from src', src, 'to destPath', destPath);
	// first delete folder
	await del(destPath, { dot: true, dryRun: true, force: true });
	// then copy dist into projects tools folder
	await ncpAsync(src, destPath);
	logger.log('postinstall copied files from src', src, 'to destPath', destPath);
}

export default postinstall;
