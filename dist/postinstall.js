'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let postinstall = (() => {
	var ref = _asyncToGenerator(function* () {
		const cwd = _path2.default.resolve();
		// first delete folder
		const destFolder = _path2.default.join(process.cwd(), 'tools');
		console.log('cwd', cwd, 'process.cwd()', process.cwd(), 'destFolder', destFolder);
		debug(`try to delete folder(s) ${ destFolder }`);
		// await del(destFolder, { dot: true });
		// then copy src into projects tools folder
		// ncp(source, destFolder, function (err) {
		// 	if (err) {
		// 		return console.error(err);
		// 	}
		// 	console.log('done!');
		// });
	});

	return function postinstall() {
		return ref.apply(this, arguments);
	};
})();

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

// import ncp from 'ncp';
// import del from 'del';


const debug = require('debug')('dt');

exports.default = postinstall;