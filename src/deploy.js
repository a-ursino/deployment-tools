/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import bump from './bump';
import build from './build';
import upload from './upload';
import c from './libs/config';

async function deploy() {
	// update package.json and web.config version
	const config = c().load();
	await bump(config);
	// build (clean, build)
	await build(config);
	// upload to azure storage
	await upload(config);
}

export default deploy;
