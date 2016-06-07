'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let upload = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		try {
			const storageName = process.env.STORAGE_NAME;
			const storageKey = process.env.STORAGE_KEY;
			debug(`Azure Storage name ${ storageName } key ${ storageKey }`);
			const blobService = _azureStorage2.default.createBlobService(storageName, storageKey);
			// promisify all azure methods. (append Async at the end of the method)
			const bs = (0, _bluebird.promisifyAll)(blobService);

			const container = config.getEnsure('projectName', 'Set a valid azureProjectName(container) inside package.json');
			// read again the correct package.json
			const pkg = JSON.parse((yield _fs2.default.readFileAsync(config.getEnsure('packageJson'))));
			const version = pkg.version;
			debug(`Upload files to container ${ container } with ${ version }`);
			// create the project folder if not exists
			yield bs.createContainerIfNotExistsAsync(container, { publicAccessLevel: 'blob' });
			// check if there is already this version
			const blobResult = yield bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
			if (blobResult.entries.length > 0) {
				throw new Error(`The version ${ version } was already deployed on the azure storage`);
			}

			const filesToUpload = [];
			const buildPathJs = config.get('buildPathJs');
			const buildPathCss = config.get('buildPathCss');
			// js?
			if (buildPathJs !== '') {
				const jsFiles = yield recDir(_path2.default.join(process.cwd(), buildPathJs));
				debug(`Upload js files ${ jsFiles } from path ${ buildPathJs }`);
				// Merge the second array into the first one
				// Array.prototype.push.apply(filesToUpload, jsFiles);
				// from apply to spread operator
				filesToUpload.push(...jsFiles);
			}
			// css?
			if (buildPathCss !== '') {
				const cssFiles = yield recDir(_path2.default.join(process.cwd(), buildPathCss));
				debug(`Upload css files ${ cssFiles } from path ${ buildPathCss }`);
				// Merge the second array into the first one
				// Array.prototype.push.apply(filesToUpload, cssFiles);
				// from apply to spread operator
				filesToUpload.push(...cssFiles);
			}
			debug(`Files to upload ${ filesToUpload }`);
			// upload files in parallel
			yield Promise.all(filesToUpload.map(function (i) {
				return bs.createBlockBlobFromLocalFileAsync(container, `${ version }/${ i }`, i);
			}));
		} catch (e) {
			_logger2.default.error('upload', e);
		}
	});

	return function upload(_x) {
		return ref.apply(this, arguments);
	};
})();

var _bluebird = require('bluebird');

var _azureStorage = require('azure-storage');

var _azureStorage2 = _interopRequireDefault(_azureStorage);

var _config = require('./libs/config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _recursiveReaddir = require('recursive-readdir');

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('./libs/fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright © 2014-2016 killanaca All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

require('dotenv').config();
const debug = require('debug')('dt');
const recDir = (0, _bluebird.promisify)(_recursiveReaddir2.default);

const loadConfig = () => (0, _config2.default)().load();

exports.default = upload;