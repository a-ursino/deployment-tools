/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*/
import fu from './libs/files-utils';
import pkg from '../package.json';
import c from './libs/config';

async function bump() {
	const config = c().load();
	const versionRequest = process.argv[process.argv.length - 1];
	// update package.json and web.config(OPT-IN) in parallel
	await Promise.all([
		fu.updatePackageJson(versionRequest, pkg, config),
		fu.updateWebconfig(versionRequest, pkg, config),
	]);
}

export default bump;
