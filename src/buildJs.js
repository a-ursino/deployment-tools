/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import webpackTask from './utils/webpack';
import webconfigChunk from './utils/webconfig-chunk';
import c from './libs/config';
import logger from './libs/logger';

const loadConfig = () => c().load();

/**
 * lint, transpile and minify Js files via webpack
 * This task could be called directly
 * @param {Object} config The config Object
 * @return {Promise} A Promise
 */
async function webpack(config = loadConfig()) {
	try {
		await webpackTask(config);
		// update web.config
		await webconfigChunk({ webConfig: config.get('webConfig'), jsLongTermHash: config.get('jsLongTermHash') });
	} catch (e) {
		logger.error(e);
	}
}

export default webpack;
