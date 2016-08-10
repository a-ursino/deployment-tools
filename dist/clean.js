'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * Delete and recreate folders
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 */
let clean = (() => {
	var _ref = _asyncToGenerator(function* ({ config = loadConfig() } = {}) {
		const distFolder = [];
		// delete js build folder?
		if (config.get('buildPathJs')) {
			distFolder.push(_path2.default.join(process.cwd(), config.get('buildPathJs')));
		}

		// delete css build folder?
		if (!config.get('preserveBuildPathCss') && config.get('buildPathCss')) {
			distFolder.push(_path2.default.join(process.cwd(), config.get('buildPathCss')));
		}

		// delete image build folder?
		if (config.get('imagesPath')) {
			distFolder.push(_path2.default.join(process.cwd(), `${ (0, _trimEnd2.default)(config.get('imagesPath'), '/') }-temp`));
		}

		debug(`[CLEAN] try to delete folder(s) ${ distFolder }`);
		yield (0, _del2.default)(distFolder, { dot: true, force: true });
		debug(`[CLEAN] deleted folder(s) ${ distFolder }`);
		yield _fs2.default.makeDirsAsync(distFolder);
		debug(`[CLEAN] created folder(s) ${ distFolder }`);
	});

	return function clean(_x) {
		return _ref.apply(this, arguments);
	};
})();

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _fs = require('./libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _trimEnd = require('lodash/trimEnd');

var _trimEnd2 = _interopRequireDefault(_trimEnd);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('dt');

const loadConfig = () => (0, _config2.default)().load();exports.default = clean;