'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let postinstall = (() => {
	var ref = _asyncToGenerator(function* () {
		const ncpAsync = (0, _bluebird.promisify)(_ncp2.default);
		// this is the path of the package: ..../node_modules/deployment-tools
		const packagePath = process.cwd();
		const src = _path2.default.join(packagePath, 'dist');
		const projectPath = _path2.default.join(packagePath, '../../');
		const destPath = _path2.default.join(projectPath, 'tools');
		_logger2.default.log(`[postinstall] try to copy files from src:${ src } to destPath:${ destPath }`);
		// first delete folder
		yield (0, _del2.default)(destPath, { dot: true, dryRun: true, force: true });
		// then copy dist into projects tools folder
		yield ncpAsync(src, destPath);
		_logger2.default.log(`[postinstall] copied files from src:${ src } to destPath:${ destPath }`);
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

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = postinstall;