'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


/**
 * Copy the images (jpg,png,gif,svg) inside `imagesPath` to a temp folder and compress them.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @param {boolean} [obj.cleaned=false] - Already performed the cleaning phase
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run buildImages
 */

let buildImages = (() => {
	var ref = _asyncToGenerator(function* ({ config = loadConfig(), cleaned = false } = {}) {
		// we must clean??
		if (!cleaned) yield (0, _clean2.default)(config);
		// copy image to temp folder
		if (!config.get('imagesPath')) {
			return;
		}
		const srcPath = _path2.default.join(process.cwd(), config.get('imagesPath'));
		const srcPathGlob = `${ srcPath }**/*.{jpg,png,gif,svg}`;
		// normalize path. remove the trailing slash from /data/images/ -> /data/images
		const dstPath = _path2.default.join(process.cwd(), `${ (0, _trimEnd2.default)(config.get('imagesPath'), '/') }-temp`);
		debug(`try to minify images from ${ srcPathGlob } to ${ dstPath }`);
		const files = yield (0, _imagemin2.default)([srcPathGlob], dstPath, {
			plugins: [(0, _imageminMozjpeg2.default)({ targa: false }), (0, _imageminPngquant2.default)({ quality: '65-80' }), (0, _imageminGifsicle2.default)()]
		});
		_logger2.default.log('minified images', files.map(function (o) {
			return o.path;
		}).join(' , '));
	});

	return function buildImages(_x) {
		return ref.apply(this, arguments);
	};
})();

var _trimEnd = require('lodash/trimEnd');

var _trimEnd2 = _interopRequireDefault(_trimEnd);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('dt');

const loadConfig = () => (0, _config2.default)().load();exports.default = buildImages;