'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * Lint JavaScript files
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run lint
 */
let lint = (() => {
	var _ref = _asyncToGenerator(function* ({ config = loadConfig() } = {}) {
		try {
			const CLIEngine = _eslint2.default.CLIEngine;
			const cli = new CLIEngine({
				configFile: _path2.default.join(process.cwd(), config.get('srcJsPath'), '.eslintrc')
			});
			const jsFolder = _path2.default.join(process.cwd(), config.get('srcJsPath'));
			const eslintReport = cli.executeOnFiles([jsFolder]);
			_logger2.default.log(_util2.default.inspect(eslintReport.results.filter(function (i) {
				return i.errorCount > 0;
			}), { showHidden: true, depth: null }));
		} catch (e) {
			_logger2.default.error('ERROR', e, e.stack);
		}
	});

	return function lint(_x) {
		return _ref.apply(this, arguments);
	};
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _eslint = require('eslint');

var _eslint2 = _interopRequireDefault(_eslint);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const loadConfig = () => (0, _config2.default)().load();exports.default = lint;