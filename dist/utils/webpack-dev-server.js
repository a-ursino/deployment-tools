'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


/**
 * Start Webpack Dev Server
 * @param {object} [obj] - obj
 * @param {boolean} [obj.config=loadConfig()] - The config object
 * @return {Promise} A Promise
 */

let wp = (() => {
	var ref = _asyncToGenerator(function* ({ config = loadConfig() } = {}) {
		const webpackConfig = (0, _webpackHelper2.default)(config, true);
		// Start webpack-dev-server
		const server = new _webpackDevServer2.default((0, _webpack2.default)(webpackConfig), {
			hot: true, //  adds the HotModuleReplacementPlugin and switch the server to hot mode.
			contentBase: 'data', // Directory of index.html
			progress: true,
			// webpack-dev-middleware options
			stats: { colors: true },
			quiet: false,
			colors: true,
			noColors: false,
			noInfo: false
		});
		return new Promise(function (resolve, reject) {
			server.listen(8080, 'localhost', function (err) {
				if (err) return reject(err);
				return resolve();
			});
		});
	});

	return function wp(_x) {
		return ref.apply(this, arguments);
	};
})();

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackHelper = require('./webpack-helper');

var _webpackHelper2 = _interopRequireDefault(_webpackHelper);

var _config = require('../libs/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const loadConfig = () => (0, _config2.default)().load();exports.default = wp;