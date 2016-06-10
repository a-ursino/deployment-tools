'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let imagemin = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		// copy image to temp folder
		if (!config.get('imagePath')) {
			return;
		}
		const srcPath = _path2.default.join(process.cwd(), config.get('imagePath'));
		// normalize path. remove the trailing slash from /data/images/ -> /data/images
		const dstPath = _path2.default.join(process.cwd(), `${ (0, _trimEnd2.default)(config.get('imagePath'), '/') }-temp`);
		debug('try to copy images from ', srcPath, 'to', dstPath);
		const files = yield (0, _imagemin2.default)([`${ srcPath }*.{jpg,png,gif}`], dstPath, {
			plugins: [(0, _imageminMozjpeg2.default)({ targa: true }), (0, _imageminPngquant2.default)({ quality: '65-80' }), (0, _imageminGifsicle2.default)()]
		});
		_logger2.default.log('minified images', files.map(function (o) {
			return o.path;
		}).join(' , '));
	});

	return function imagemin(_x) {
		return ref.apply(this, arguments);
	};
})();

var _trimEnd = require('lodash/trimEnd');

var _trimEnd2 = _interopRequireDefault(_trimEnd);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _imagemin = require('imagemin');

var _imagemin2 = _interopRequireDefault(_imagemin);

var _imageminMozjpeg = require('imagemin-mozjpeg');

var _imageminMozjpeg2 = _interopRequireDefault(_imageminMozjpeg);

var _imageminPngquant = require('imagemin-pngquant');

var _imageminPngquant2 = _interopRequireDefault(_imageminPngquant);

var _imageminGifsicle = require('imagemin-gifsicle');

var _imageminGifsicle2 = _interopRequireDefault(_imageminGifsicle);

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

const debug = require('debug')('dt');

const loadConfig = () => (0, _config2.default)().load();

exports.default = imagemin;