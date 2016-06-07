'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


// OR with promisify.fromCallback
// const readFileAsync = (file) => promisify.fromCallback(cb => fs.readFile(file, 'utf8', cb));
// OR
// const readFileAsync = new Promise((resolve, reject) => {
// 	fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data)); // eslint-disable-line no-confusing-arrow
// });

let writeFileAsync = (() => {
	var ref = _asyncToGenerator(function* (filepath, content) {
		const writeFilep = (0, _bluebird.promisify)(_fs2.default.writeFile);
		const fullPath = _path2.default.join(process.cwd(), filepath);
		debug(`try to write a file at path ${ fullPath }`);
		return yield writeFilep(fullPath, content);
	});

	return function writeFileAsync(_x, _x2) {
		return ref.apply(this, arguments);
	};
})();

let readFileAsync = (() => {
	var ref = _asyncToGenerator(function* (filepath) {
		const readFilep = (0, _bluebird.promisify)(_fs2.default.readFile);
		const fullPath = _path2.default.join(process.cwd(), filepath);
		debug(`try to read a file at path ${ fullPath }`);
		return yield readFilep(fullPath, 'utf8');
	});

	return function readFileAsync(_x3) {
		return ref.apply(this, arguments);
	};
})();

/**
 * Check if a file exists on the specified path
 * Is an async function, it makes its promise. Any uncaught exception inside it becomes a rejection of that promise
 * @param  {String} filepath The filepath
 * @return {Boolean}      true if the file exists, false otherwise
 */


let fileExistsAsync = (() => {
	var ref = _asyncToGenerator(function* (filepath) {
		const fullPath = _path2.default.join(process.cwd(), filepath);
		debug(`check if file filepath:${ filepath } fullPath:${ fullPath } exists`);
		try {
			// fs.access throws an exception if the file doesn't exists.
			// so we can return false
			yield fileExistsPromise(fullPath, _fs2.default.R_OK);
			return true;
		} catch (e) {
			return false;
		}
	});

	return function fileExistsAsync(_x4) {
		return ref.apply(this, arguments);
	};
})();

/**
 * Check if file exists on the specified path
 * @param  {String} path The filepath
 * @return {Promise}      A promise that returns true if the file exists, false otherwise
 */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _bluebird = require('bluebird');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright © 2014-2016 killanaca All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

const debug = require('debug')('dt');

// NOTE: Promise.promisify takes a function that takes a callback as its last argument and converts it into a function that returns a promise (without the need for a callback)

const makeDirAsync = (0, _bluebird.promisify)(_mkdirp2.default);
const fileExistsPromise = (0, _bluebird.promisify)(_fs2.default.access);function fileExistsPr(path) {
	return fileExistsPromise(path, _fs2.default.R_OK).then(() => true).catch(Error, () => false);
}

/**
* Create folder(s) from a string path or an array of string path
* @param  {String|Array} paths a string path or an array of string path
* @return {Promise}      The promise object that is resolved when all the files are created
*/
const makeDirsAsync = paths => {
	if ((0, _isString2.default)(paths)) {
		return makeDirAsync(paths);
	} else if ((0, _isArray2.default)(paths)) {
		return Promise.all(paths.map(i => makeDirAsync(i)));
	}
	throw new Error(`Invalid parameter name  ${ name }. It must be a string or an array`);
};

exports.default = {
	writeFileAsync,
	readFileAsync,
	readFileSync: _fs2.default.readFileSync,
	makeDirsAsync,
	fileExistsAsync,
	fileExistsPr
};