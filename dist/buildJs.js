'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


/**
 * lint, transpile and minify Js files via webpack
 * This task could be called directly
 * @param {Object} config The config Object
 * @return {Promise} A Promise
 */

let webpack = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		try {
			yield (0, _webpack2.default)(config);
			// update web.config
			yield (0, _webconfigChunk2.default)({ webConfig: config.get('webConfig'), jsLongTermHash: config.get('jsLongTermHash') });
		} catch (e) {
			_logger2.default.error(e);
		}
	});

	return function webpack(_x) {
		return ref.apply(this, arguments);
	};
})();

var _webpack = require('./utils/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webconfigChunk = require('./utils/webconfig-chunk');

var _webconfigChunk2 = _interopRequireDefault(_webconfigChunk);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright © 2014-2016 killanaca All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

const loadConfig = () => (0, _config2.default)().load();exports.default = webpack;