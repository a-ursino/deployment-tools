'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


/**
 * Increment version inside package.json file according to a category
 * @param  {String} category It must be a value between patch, minor, major
 * @param  {Object} pkg The package.json object loaded into memory
 * @param  {Object} config The config object (from package.json)
 * @return {Promise}         The promise
 */

let updatePackageJson = (() => {
	var ref = _asyncToGenerator(function* (category, pkg, config) {
		const packageJson = config.get('packageJson');
		if (!packageJson) {
			return false;
		}
		// check if file exists
		const exists = yield _fs2.default.fileExistsAsync(packageJson);
		if (!exists) {
			_logger2.default.error('updatePackageJson file not found', packageJson);
			return false;
		}
		const newVersion = (0, _version2.default)(category, pkg.version);
		_logger2.default.log(`Update package.json from ${ pkg.version } to ${ newVersion }`);
		const newPackageJson = Object.assign({}, pkg, { version: newVersion });
		// write the package.json updated and return a promise
		return _fs2.default.writeFileAsync(packageJson, JSON.stringify(newPackageJson, null, 2));
	});

	return function updatePackageJson(_x, _x2, _x3) {
		return ref.apply(this, arguments);
	};
})();

/**
* [updateWebconfig description]
* Is an async function, it makes its promise. Any uncaught exception inside it becomes a rejection of that promise
* @param  {String} category It must be a value between patch, minor, major
* @param  {Object} pkg The package.json object
* @param  {Object} config The configuration Object from package.json
* @return {Promise} The promise
*/


let updateWebconfig = (() => {
	var ref = _asyncToGenerator(function* (category, pkg, config) {
		// check if config parameter exists. Web.config is OPT-IN
		const webConfig = config.get('webConfig');
		if (!webConfig) {
			// immediate values are implicitly wrapped in an already-resolved promise, which is then awaited.
			// await automatically promise-wraps any non-promise values and since the value is a non-promise, the wrapped promise will immediately resolve
			// unwrapping is an async step, so we have to wait a tick before we can get that value
			// _context.abrupt('return', _context.sent)
			return yield false;
		}
		// check if file exists. Web.config is OPT-IN
		const exists = yield _fs2.default.fileExistsAsync(webConfig);
		if (!exists) {
			_logger2.default.error('updateWebconfig file not found', webConfig);
			return false;
		}
		const newVersion = (0, _version2.default)(category, pkg.version);
		const xmlString = yield _fs2.default.readFileAsync(webConfig);
		const newWebconfigXmlString = xmlString.replace(/<add .*"swversion".*\/>/igm, `<add key="swversion" value="${ newVersion }" />`);
		return _fs2.default.writeFileAsync(webConfig, newWebconfigXmlString);
	});

	return function updateWebconfig(_x4, _x5, _x6) {
		return ref.apply(this, arguments);
	};
})();

var _fs = require('./fs');

var _fs2 = _interopRequireDefault(_fs);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _version = require('./version.js');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	getNewVersion: _version2.default,
	updatePackageJson,
	updateWebconfig
};