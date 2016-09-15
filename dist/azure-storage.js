'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * Configure CORS settings for Azure Storage. You can change the settings using azure-storage-settings.json file.
 * We use the the azure remote service as data validator, so if there is something wrong in the settings we display the error in the response.
 * This task could be called directly
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run azureStorage
 */
let azureStorage = (() => {
	var _ref = _asyncToGenerator(function* () {
		// read the config settings from env
		const storageName = env.STORAGE_NAME;
		const storageKey = env.STORAGE_KEY;
		debug(`Azure Storage name ${ storageName } key ${ storageKey }`);
		// read the azure settings from json file
		const azureSettings = yield _fs2.default.readJsonAsync('azure-storage-settings.json');
		const blobService = _azureStorage2.default.createBlobService(storageName, storageKey);
		// NOTE: promisify all azure methods. (bluebird append Async at the end of the method)
		const bs = (0, _bluebird.promisifyAll)(blobService);
		const remoteSettings = yield bs.getServicePropertiesAsync();
		const newSettings = Object.assign({}, azureSettings, remoteSettings);
		_logger2.default.log(`The new Azure Storage settings are: ${ newSettings }`);
		const response = yield bs.setServicePropertiesAsync(newSettings);
		_logger2.default.log(`The Azure Storage service response: ${ response }`);
	});

	return function azureStorage() {
		return _ref.apply(this, arguments);
	};
})();

var _bluebird = require('bluebird');

var _azureStorage = require('azure-storage');

var _azureStorage2 = _interopRequireDefault(_azureStorage);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _fs = require('./libs/fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const envalid = require('envalid');
const debug = require('debug')('dt');

// validate enviroment variables
// STORAGE_NAME and STORAGE_KEY are required and a string
const { str } = envalid;
const env = envalid.cleanEnv(process.env, {
	STORAGE_NAME: str(),
	STORAGE_KEY: str()
});exports.default = azureStorage;