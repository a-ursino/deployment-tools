'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let deploy = (() => {
	var ref = _asyncToGenerator(function* () {
		// update package.json and web.config version
		const config = (0, _config2.default)().load();
		yield (0, _bump2.default)(config);
		// build (clean, build)
		yield (0, _build2.default)(config);
		// upload to azure storage
		yield (0, _upload2.default)(config);
	});

	return function deploy() {
		return ref.apply(this, arguments);
	};
})();

var _bump = require('./bump');

var _bump2 = _interopRequireDefault(_bump);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

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

exports.default = deploy;