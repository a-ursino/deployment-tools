/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*/
import logger from './libs/logger';

process.on('unhandledRejection', (reason, p) => {
	logger.error('unhandledRejection', reason, p);
});
process.on('uncaughtException', (err) => {
	logger.error(`Caught exception: ${err}`);
});

/**
* [run description]
* @param  {Function} fn      A function async to generator
* @param  {Object}   [options] The option to pass to promise
* @return {Promise}           A Promise
*/
function run(fn, options) { // eslint-disable-line consistent-return
	try {
		const task = typeof fn.default === 'undefined' ? fn : fn.default;
		const start = new Date();
		logger.log(`Starting '${task.name}${options ? `(${options})` : ''}'...`);
		return task(options).then(() => {
			const end = new Date();
			const time = end.getTime() - start.getTime();
			logger.log(`Finished '${task.name}${options ? `(${options})` : ''}' after ${time} ms`);
		});
	} catch (e) {
		logger.error('error', e);
	}
}

// process.mainModule.children.length === 0 &&
if (process.argv.length > 2) {
	// __filename is the path of this file
	// delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
	const module = require(`./${process.argv[2]}.js`).default; // eslint-disable-line global-require
	run(module).catch(err => logger.error(err.stack));
} else {
	logger.log('Specify a function to run');
}

export default run;
