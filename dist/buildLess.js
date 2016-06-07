'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let less = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		try {
			yield (0, _less2.default)(config, true);
		} catch (e) {
			console.error(e); // eslint-disable-line no-console
		}
	});

	return function less(_x) {
		return ref.apply(this, arguments);
	};
})();

var _less = require('./utils/less');

var _less2 = _interopRequireDefault(_less);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

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

exports.default = less;