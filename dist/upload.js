'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let prepareCssFiles = (() => {
	var ref = _asyncToGenerator(function* ({ buildPathCss, version }) {
		if (buildPathCss !== '') {
			// get all the files paths from source
			const cssFiles = yield recDir(_path2.default.join(process.cwd(), buildPathCss));
			debug(`Upload css files ${ cssFiles } from path ${ buildPathCss }`);
			// css files on storage: 5.2.8/css/main.css
			// css files with versioning
			const f = cssFiles.map(function (i) {
				return { file: i, remoteDest: `${ version }/${ _path2.default.relative(process.cwd(), i) }` };
			});
			return f;
		}
		return [];
	});

	return function prepareCssFiles(_x) {
		return ref.apply(this, arguments);
	};
})();

let prepareJsFiles = (() => {
	var ref = _asyncToGenerator(function* ({ buildPathJs, version = '', jsLongTermHash = '' }) {
		// js?
		if (buildPathJs !== '') {
			const jsFiles = yield recDir(_path2.default.join(process.cwd(), buildPathJs));
			debug(`Upload js files ${ jsFiles } from path ${ buildPathJs }`);

			// NOTE: if long-term-cache is enabled (via jsLongTermHash option) don't use folder version inside path. File Hash is the version.
			// option a) Folder version es: http://your.domain.cdn/project/version/bundles/main.js
			if (!jsLongTermHash) {
				return jsFiles.map(function (i) {
					return { file: i, remoteDest: `${ version }/${ _path2.default.relative(process.cwd(), i) }` };
				});
			}
			// option b) Hash version es: http://your.domain.cdn/project/bundles/1b956c239862619d3a59.js
			return jsFiles.map(function (i) {
				return { file: i, remoteDest: `${ _path2.default.relative(process.cwd(), i) }` };
			});
		}
		return [];
	});

	return function prepareJsFiles(_x2) {
		return ref.apply(this, arguments);
	};
})();

let prepareImagesFiles = (() => {
	var ref = _asyncToGenerator(function* ({ imagesPath }) {
		if (imagesPath !== '') {
			// read images from temp path not the source one
			const src = _path2.default.join(process.cwd(), imagesPath);
			const files = yield recDir(src);
			debug(`Upload images files ${ files } from path ${ imagesPath }`);
			// images files on storage: images/background.png
			// images files without versioning
			// the images are inside folder temp folder (images-temp) but goes inside imagesPath /images/
			// remove the first / otherwise an empty folder is created on storage
			const dest = imagesPath.substr(1);
			const f = files.map(function (i) {
				return { file: i, remoteDest: `${ dest }${ _path2.default.basename(i) }` };
			});
			return f;
		}
		return [];
	});

	return function prepareImagesFiles(_x3) {
		return ref.apply(this, arguments);
	};
})();

let upload = (() => {
	var ref = _asyncToGenerator(function* (config = loadConfig()) {
		try {
			// read the config settings from env
			const storageName = process.env.STORAGE_NAME;
			const storageKey = process.env.STORAGE_KEY;
			debug(`Azure Storage name ${ storageName } key ${ storageKey }`);
			const blobService = _azureStorage2.default.createBlobService(storageName, storageKey);
			// promisify all azure methods. (bluebird append Async at the end of the method)
			const bs = (0, _bluebird.promisifyAll)(blobService);
			const container = config.getEnsure('projectName', 'Set a valid azureProjectName(container) inside package.json');
			// read again the correct package.json
			const pkg = JSON.parse((yield _fs2.default.readFileAsync(config.getEnsure('packageJson'))));
			const version = pkg.version;
			_logger2.default.log(`Upload files to container: ${ container } with version: ${ version }`);
			// create the project container if not exists
			yield bs.createContainerIfNotExistsAsync(container, { publicAccessLevel: 'blob' });
			// check if there is already this version
			const blobResult = yield bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
			if (blobResult.entries.length > 0) {
				throw new Error(`The version ${ version } was already deployed on the azure storage`);
			}

			const filesToUpload = [];
			filesToUpload.push(...(yield prepareCssFiles({ buildPathCss: config.get('buildPathCss'), version })));
			filesToUpload.push(...(yield prepareJsFiles({ buildPathJs: config.get('buildPathJs'), version, jsLongTermHash: config.get('jsLongTermHash') })));
			filesToUpload.push(...(yield prepareImagesFiles({ imagesPath: config.get('imagesPath') })));

			// logger.log(`Files to upload on container ${container} ${util.inspect(filesToUpload)}`);
			// upload files in parallel
			yield Promise.all(filesToUpload.map(function (f) {
				debug(f.remoteDest, f.file);
				return bs.createBlockBlobFromLocalFileAsync(container, f.remoteDest, f.file);
			}));
		} catch (e) {
			_logger2.default.error('upload', e);
		}
	});

	return function upload(_x4) {
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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();
const debug = require('debug')('dt');
const recDir = (0, _bluebird.promisify)(_recursiveReaddir2.default);

const loadConfig = () => (0, _config2.default)().load();

exports.default = upload;