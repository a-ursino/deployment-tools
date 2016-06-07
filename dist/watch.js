'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let watch = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		const tasks = [];
		// compile less the first time
		tasks.push((0, _less2.default)(config));
		const watchLess = _path2.default.join(process.cwd(), config.get('srcLess'));
		_chokidar2.default.watch(watchLess).on('change', function (filepath) {
			_logger2.default.log(`${ filepath } changed`);
			(0, _less2.default)(config);
		});
		// add webpack to task. watch and compile js files
		tasks.push((0, _webpackDevServer2.default)(config));
		yield Promise.all(tasks);
	});

	return function watch(_x) {
		return ref.apply(this, arguments);
	};
})();

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _webpackDevServer = require('./utils/webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _less = require('./utils/less');

var _less2 = _interopRequireDefault(_less);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright © 2014-2016 killanaca All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

const loadConfig = () => (0, _config2.default)().load();

exports.default = watch;