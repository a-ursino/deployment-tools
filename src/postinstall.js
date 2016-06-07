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

async function postinstall() {
	// this is the path of the package: ..../node_modules/deployment-tools
	const packagePath = process.cwd();
	const src = path.join(packagePath, 'dist');
	const projectPath = path.join(packagePath, '../../');
	const destPath = path.join(projectPath, 'tools');
	console.log('src', src, 'projectPath', projectPath, 'destPath', destPath);
	// first delete folder
	await del(destPath, { dot: true, dryRun: true });
	// then copy dist into projects tools folder
	ncp(src, destPath, (err) => {
		if (err) {
			return console.error(err);
		}
		return console.log('done!');
	});
}

export default postinstall;
