'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let bump = (() => {
	var ref = _asyncToGenerator(function* () {
		const config = (0, _config2.default)().load();
		const versionRequest = process.argv[process.argv.length - 1];
		// update package.json and web.config(OPT-IN) in parallel
		yield Promise.all([_filesUtils2.default.updatePackageJson(versionRequest, _package2.default, config), _filesUtils2.default.updateWebconfig(versionRequest, _package2.default, config)]);
	});

	return function bump() {
		return ref.apply(this, arguments);
	};
})();

var _filesUtils = require('./libs/files-utils');

var _filesUtils2 = _interopRequireDefault(_filesUtils);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = bump;