'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * Watch JavaScript (via webpack), less/sass folder.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 */
let watch = (() => {
	var _ref = _asyncToGenerator(function* ({ config = loadConfig() } = {}) {
		// clean folder
		yield (0, _clean2.default)({ config });
		const tasks = [];
		// add webpack to task. watch and compile js files
		tasks.push((0, _webpackDevServer2.default)({ config }));

		// watch less files???
		if (config.get('srcLess')) {
			// compile less files for the first time
			tasks.push((0, _less2.default)(config, false));
			const watchFiles = _path2.default.join(process.cwd(), config.get('srcLess'));
			_chokidar2.default.watch(watchFiles).on('change', function (filepath) {
				_logger2.default.log(`${ filepath } less file changed`);
				(0, _less2.default)(config);
			});
		}
		// watch sass files???
		if (config.get('srcSass')) {
			// compile sass files for the first time
			tasks.push((0, _sass2.default)(config, false));
			const watchFiles = _path2.default.join(process.cwd(), config.get('srcSass'));
			_chokidar2.default.watch(watchFiles).on('change', function (filepath) {
				_logger2.default.log(`${ filepath } sass file changed`);
				(0, _sass2.default)(config);
			});
		}

		yield Promise.all(tasks);
	});

	return function watch(_x) {
		return _ref.apply(this, arguments);
	};
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _webpackDevServer = require('./utils/webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _less = require('./utils/less');

var _less2 = _interopRequireDefault(_less);

var _sass = require('./utils/sass');

var _sass2 = _interopRequireDefault(_sass);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const loadConfig = () => (0, _config2.default)().load();exports.default = watch;