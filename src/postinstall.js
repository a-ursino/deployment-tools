/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

// import ncp from 'ncp';
// import del from 'del';
import path from 'path';
const debug = require('debug')('dt');

async function postinstall() {
	const cwd = path.resolve();
	// first delete folder
	const destFolder = path.join(process.cwd(), 'tools');
	console.log('cwd', cwd, 'process.cwd()', process.cwd(), 'destFolder', destFolder);
	debug(`try to delete folder(s) ${destFolder}`);
	// await del(destFolder, { dot: true });
	// then copy src into projects tools folder
	// ncp(source, destFolder, function (err) {
	// 	if (err) {
	// 		return console.error(err);
	// 	}
	// 	console.log('done!');
	// });
}

export default postinstall;
