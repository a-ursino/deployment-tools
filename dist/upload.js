'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.prepareImagesFilesAsync = exports.prepareJsFilesAsync = exports.prepareCssFilesAsync = undefined;


/**
 * Build an array of object with filepath and remote destination
 * If we use long-term-cache, read hashed files only, otherwise read all files inside buildPathCss folder
 * @param {object} [obj] - obj
 * @param {string} obj.buildPathCss - The path where to put the compiled files
 * @param {string} obj.version - The version of the files
 * @param {boolean} [obj.longTermHash=false] - Use long-term-cache
 * @return {Promise} A Promise
 */

let prepareCssFiles = (() => {
	var ref = _asyncToGenerator(function* ({ dir = recDir, buildPathCss, version = '', longTermHash = false } = {}) {
		if (buildPathCss) {
			// get all the files paths from source
			const files = yield dir(_path2.default.join(process.cwd(), buildPathCss));
			debug(`Upload css files ${ files } from path ${ buildPathCss }`);
			// NOTE: if long-term-cache is enabled (via LongTermHash option) don't use folder version inside path. File Hash is the version.
			// option a) Folder version es: http://your.domain.cdn/project/version/css/main.js
			if (!longTermHash) {
				return files.map(function (i) {
					return { file: i, remoteDest: `${ version }/${ _path2.default.relative(process.cwd(), i) }` };
				});
			}
			// option b) Hash version es: http://your.domain.cdn/project/css/1b956c239862619d3a59.js
			// avoid to upload non hashed files
			return files.filter(function (i) {
				return md5RegExpCss.test(i);
			}).map(function (i) {
				return { file: i, remoteDest: `${ _path2.default.relative(process.cwd(), i) }` };
			});
		}
		return [];
	});

	return function prepareCssFiles(_x) {
		return ref.apply(this, arguments);
	};
})();

let prepareJsFiles = (() => {
	var ref = _asyncToGenerator(function* ({ dir = recDir, buildPathJs, version = '', longTermHash = '' } = {}) {
		// js?
		if (buildPathJs) {
			const files = yield dir(_path2.default.join(process.cwd(), buildPathJs));
			debug(`Upload js files ${ files } from path ${ buildPathJs }`);
			// NOTE: if long-term-cache is enabled (via LongTermHash option) don't use folder version inside path. File Hash is the version.
			// option a) Folder version es: http://your.domain.cdn/project/version/bundles/main.js
			if (!longTermHash) {
				return files.map(function (i) {
					return { file: i, remoteDest: `${ version }/${ _path2.default.relative(process.cwd(), i) }` };
				});
			}
			// option b) Hash version es: http://your.domain.cdn/project/bundles/1b956c239862619d3a59.js
			return files.filter(function (i) {
				return md5RegExpJs.test(i);
			}).map(function (i) {
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
	var ref = _asyncToGenerator(function* ({ dir = recDir, imagesPath } = {}) {
		if (imagesPath) {
			// read images from temp path not the source one
			const src = _path2.default.join(process.cwd(), imagesPath);
			const files = yield dir(src);
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
	var ref = _asyncToGenerator(function* ({ config = loadConfig(), env = loadEnv() } = {}) {
		// read the config settings from env
		const storageName = env.STORAGE_NAME;
		const storageKey = env.STORAGE_KEY;
		const longTermHash = config.get('longTermHash');
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
		// check if there's already this version. Avoid this check if we are in longTermHash mode
		if (longTermHash) {
			const blobResult = yield bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
			if (blobResult.entries.length > 0) {
				throw new Error(`The version ${ version } was already deployed on the azure storage`);
			}
		}

		const filesToUpload = [];
		filesToUpload.push(...(yield prepareCssFiles({ buildPathCss: config.get('buildPathCss'), version, longTermHash })));
		filesToUpload.push(...(yield prepareJsFiles({ buildPathJs: config.get('buildPathJs'), version, longTermHash })));
		filesToUpload.push(...(yield prepareImagesFiles({ imagesPath: config.get('imagesPath') })));

		// logger.log(`Files to upload on container ${container} ${util.inspect(filesToUpload)}`);
		// upload files in parallel
		yield Promise.all(filesToUpload.map(function (f) {
			debug(f.remoteDest, f.file);
			return bs.createBlockBlobFromLocalFileAsync(container, f.remoteDest, f.file);
		}));
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

const debug = require('debug')('dt');
const envalid = require('envalid');
const { str } = envalid;

function loadEnv() {
	const env = envalid.cleanEnv(process.env, {
		STORAGE_NAME: str(),
		STORAGE_KEY: str()
	});
	return env;
}

const recDir = (0, _bluebird.promisify)(_recursiveReaddir2.default);
const loadConfig = () => (0, _config2.default)().load();
// regExp to match css files in this format: 38ef2f0c714372f9e033dad37e0cda84.css
const md5RegExpCss = /^[a-z0-9\-]+?\.[a-f0-9]{32}.css(?:\.map)?$/i;
// regExp to match js files in this format: main.0054321a4b9b5e829c03.js
const md5RegExpJs = /^[a-z0-9\-]+?\.[a-f0-9]{20}.js(?:\.map)?$/i;const prepareCssFilesAsync = exports.prepareCssFilesAsync = prepareCssFiles;
const prepareJsFilesAsync = exports.prepareJsFilesAsync = prepareJsFiles;
const prepareImagesFilesAsync = exports.prepareImagesFilesAsync = prepareImagesFiles;
exports.default = upload;