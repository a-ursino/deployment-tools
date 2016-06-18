'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


/**
 * Build, lint and minify css
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @param {boolean} obj.cleaned - perform the cleaning phase
 * @return {Promise} A Promise
 */

let buildCss = (() => {
	var ref = _asyncToGenerator(function* ({ config = loadConfig(), cleaned = false } = {}) {
		// we must clean??
		if (!cleaned) yield (0, _clean2.default)(config);

		const output = [];
		// if the srcLess is not set -> skip this task
		if (config.get('srcLess')) {
			output.push(...(yield (0, _less2.default)({ config, minify: true })));
		}

		// if the srcSass is not set -> skip this task
		if (config.get('srcSass')) {
			output.push(...(yield (0, _sass2.default)({ config, minify: true })));
		}
		const compactOutput = (0, _compact2.default)((0, _flattenDeep2.default)(output));
		console.log('compactOutput', compactOutput);
		// create a hash version of the min files
		// write css stats inside a file
		_fs2.default.writeFileSync(_path2.default.join(process.cwd(), 'css-assets-stats.json'), JSON.stringify({ assets: compactOutput }));
	});

	return function buildCss(_x) {
		return ref.apply(this, arguments);
	};
})();

var _less = require('./utils/less');

var _less2 = _interopRequireDefault(_less);

var _sass = require('./utils/sass');

var _sass2 = _interopRequireDefault(_sass);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _flattenDeep = require('lodash/flattenDeep');

var _flattenDeep2 = _interopRequireDefault(_flattenDeep);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

var _fs = require('./libs/fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const loadConfig = () => (0, _config2.default)().load();exports.default = buildCss;