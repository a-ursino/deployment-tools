'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let clean = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		// TODO: check if we must delete css folder
		const distFolder = [_path2.default.join(process.cwd(), config.get('buildPathJs')), _path2.default.join(process.cwd(), config.get('buildPathCss'))];
		// compact the array
		const distFolderCompacted = (0, _compact2.default)(distFolder);
		debug(`try to delete folder(s) ${ distFolderCompacted }`);
		yield (0, _del2.default)(distFolderCompacted, { dot: true });
		debug(`deleted folder(s) ${ distFolderCompacted }`);
		yield _fs2.default.makeDirsAsync(distFolderCompacted);
		debug(`created folder(s) ${ distFolderCompacted }`);
	});

	return function clean(_x) {
		return ref.apply(this, arguments);
	};
})();

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _fs = require('./libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

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

const debug = require('debug')('dt');

const loadConfig = () => (0, _config2.default)().load();

exports.default = clean;