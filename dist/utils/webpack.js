'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


// const webpackAsync = promisify(webpack);

// --progress --colors -p

let wp = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		// skip webpack task if srcJsPath was not set
		if (!config.get('srcJsPath')) {
			return undefined;
		}
		debug('load the webpack settings');
		const webpackConfig = (0, _webpackHelper2.default)(config);
		return new Promise(function (resolve, reject) {
			const compiler = (0, _webpack2.default)(webpackConfig);
			compiler.run(function (err, stats) {
				// only after all files was compiled
				if (err) {
					return reject(err);
				}
				_logger2.default.log('Webpack stats', stats.toString({
					source: true,
					reasons: false,
					chunks: false
				}));
				_fs2.default.writeFileSync(_path2.default.join(process.cwd(), 'wp-assets-stats.json'), JSON.stringify(stats.toJson({ chunks: false, children: false, modules: false })));
				return resolve();
			});
		});
	});

	return function wp(_x) {
		return ref.apply(this, arguments);
	};
})();

var _fs = require('../libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _logger = require('../libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../libs/config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackHelper = require('./webpack-helper');

var _webpackHelper2 = _interopRequireDefault(_webpackHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
// import { promisify } from 'bluebird';


const debug = require('debug')('dt');
const loadConfig = () => (0, _config2.default)().load();exports.default = wp;