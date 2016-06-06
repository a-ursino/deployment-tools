/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/
import lessTask from './utils/less';
import c from './libs/config';

const loadConfig = () => c().load();

async function less(config = loadConfig()) {
	try {
		await lessTask(config);
	} catch (e) {
		console.error(e); // eslint-disable-line no-console
	}
}

export default less;
