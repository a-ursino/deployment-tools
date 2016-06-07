'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let build = (() => {
	var ref = _asyncToGenerator(function* () {
		const config = (0, _config2.default)().load();
		// clean folder
		yield (0, _clean2.default)(config);
		// compile js files
		yield Promise.all([(0, _buildJs2.default)(config), (0, _buildLess2.default)(config)]);
		// upload to azure storage
	});

	return function build() {
		return ref.apply(this, arguments);
	};
})();

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _buildJs = require('./buildJs');

var _buildJs2 = _interopRequireDefault(_buildJs);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _buildLess = require('./buildLess');

var _buildLess2 = _interopRequireDefault(_buildLess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright © 2014-2016 killanaca All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

exports.default = build;