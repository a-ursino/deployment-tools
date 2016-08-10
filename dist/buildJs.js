'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Lint, transpile and minify Js files via webpack.
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @param {boolean} [obj.cleaned=false] - Already performed the cleaning phase
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run buildImages
 */
let webpack = (() => {
  var _ref = _asyncToGenerator(function* ({ config = loadConfig(), cleaned = false } = {}) {
    // we must clean??
    if (!cleaned) yield (0, _clean2.default)({ config });
    yield (0, _webpack2.default)({ config });
  });

  return function webpack(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _webpack = require('./utils/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const loadConfig = () => (0, _config2.default)().load();exports.default = webpack;