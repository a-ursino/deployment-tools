'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let postinstall = (() => {
	var ref = _asyncToGenerator(function* () {
		// this is the path of the package: ..../node_modules/deployment-tools
		const packagePath = process.cwd();
		const src = _path2.default.join(packagePath, 'dist');
		const projectPath = _path2.default.join(packagePath, '../../');
		const destPath = _path2.default.join(projectPath, 'tools');
		// first delete folder
		yield (0, _del2.default)(destPath, { dot: true, dryRun: true });
		console.log('src', src, 'projectPath', projectPath, 'destPath', destPath);
		// then copy src into projects tools folder
		(0, _ncp2.default)(src, destPath, function (err) {
			if (err) {
				return console.error(err);
			}
			return console.log('done!');
		});
	});

	return function postinstall() {
		return ref.apply(this, arguments);
	};
})();

var _ncp = require('ncp');

var _ncp2 = _interopRequireDefault(_ncp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

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

exports.default = postinstall;