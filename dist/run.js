'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('unhandledRejection', (reason, p) => {
	_logger2.default.error('unhandledRejection', reason, p);
}); /**
    *
    * Copyright © 2016 killanaca All rights reserved.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE.txt file in the root directory of this source tree.
    */

process.on('uncaughtException', err => {
	_logger2.default.error(`Caught exception: ${ err }`);
});

/**
* [run description]
* @param  {Function} fn      A function async to generator
* @param  {Object}   [options] The option to pass to promise
* @return {Promise}           A Promise
*/
function run(fn, options) {
	// eslint-disable-line consistent-return
	try {
		const task = typeof fn.default === 'undefined' ? fn : fn.default;
		const start = new Date();
		_logger2.default.log(`Starting '${ task.name }${ options ? `(${ options })` : '' }'...`);
		return task(options).then(() => {
			const end = new Date();
			const time = end.getTime() - start.getTime();
			_logger2.default.log(`Finished '${ task.name }${ options ? `(${ options })` : '' }' after ${ time } ms`);
		});
	} catch (e) {
		_logger2.default.error('error', e);
	}
}

// process.mainModule.children.length === 0 &&
if (process.argv.length > 2) {
	// __filename is the path of this file
	// delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
	const module = require(`./${ process.argv[2] }.js`).default; // eslint-disable-line global-require
	run(module).catch(err => _logger2.default.error(err.stack));
} else {
	_logger2.default.log('Specify a function to run');
}

exports.default = run;