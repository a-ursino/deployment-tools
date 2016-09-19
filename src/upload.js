import { promisify, promisifyAll } from 'bluebird';
import azure from 'azure-storage';
import recursive from 'recursive-readdir';
import path from 'path';
import c from './libs/config';
import logger from './libs/logger';
import fs from './libs/fs';

const debug = require('debug')('dt');
const envalid = require('envalid');

const { str } = envalid;

// validate enviroment variables
// STORAGE_NAME and STORAGE_KEY are required and a string
function loadEnv() {
	const env = envalid.cleanEnv(process.env, {
		STORAGE_NAME: str(),
		STORAGE_KEY: str(),
	});
	return env;
}


const recDir = promisify(recursive);
const loadConfig = () => c().load();

/**
 * Build an array of object with filepath and remote destination
 * If we use long-term-cache, read hashed files only, otherwise read all files inside buildPathCss folder
 * @param {object} [obj] - obj
 * @param {string} obj.buildPathCss - The path where to put the compiled files
 * @param {string} obj.version - The version of the files
 * @param {boolean} [obj.longTermHash=false] - Use long-term-cache
 * @return {Promise} A Promise
 */
async function prepareCssFiles({ dir = recDir, buildPathCss, version = '', longTermHash = false } = {}) {
	if (buildPathCss) {
		// get all the files paths from source
		const files = await dir(path.join(process.cwd(), buildPathCss));
		debug(`Upload css files ${files} from path ${buildPathCss}`);
		// NOTE: if long-term-cache is enabled (via LongTermHash option) don't use folder version inside path. File Hash is the version.
		// option a) Folder version es: http://your.domain.cdn/project/version/css/main.js
		if (!longTermHash) {
			return files.map(i => ({ file: i, remoteDest: `${version}/${path.relative(process.cwd(), i)}` }));
		}
		// option b) Hash version es: http://your.domain.cdn/project/css/1b956c239862619d3a59.js
		// avoid to upload non hashed files
		return files.map(i => ({ file: i, remoteDest: `${path.relative(process.cwd(), i)}` }));
	}
	return [];
}

async function prepareJsFiles({ dir = recDir, buildPathJs, version = '', longTermHash = '' } = {}) {
	// js?
	if (buildPathJs) {
		const files = await dir(path.join(process.cwd(), buildPathJs));
		debug(`Upload js files ${files} from path ${buildPathJs}`);
		// NOTE: if long-term-cache is enabled (via LongTermHash option) don't use folder version inside path. File Hash is the version.
		// option a) Folder version es: http://your.domain.cdn/project/version/bundles/main.js
		if (!longTermHash) {
			return files.map(i => ({ file: i, remoteDest: `${version}/${path.relative(process.cwd(), i)}` }));
		}
		// option b) Hash version es: http://your.domain.cdn/project/bundles/1b956c239862619d3a59.js
		return files.map(i => ({ file: i, remoteDest: `${path.relative(process.cwd(), i)}` }));
	}
	return [];
}

async function prepareImagesFiles({ dir = recDir, imagesPath } = {}) {
	if (imagesPath) {
		// read images from temp path not the source one
		const src = path.join(process.cwd(), imagesPath);
		const files = await dir(src);
		debug(`Upload images files ${files} from path ${imagesPath}`);
		// images files on storage: images/background.png
		// images files without versioning
		// the images are inside folder temp folder (images-temp) but goes inside imagesPath /images/
		// remove the first / otherwise an empty folder is created on storage
		const dest = imagesPath.substr(1);
		const f = files.map(i => ({ file: i, remoteDest: `${dest}${path.basename(i)}` }));
		return f;
	}
	return [];
}

async function upload({ config = loadConfig(), env = loadEnv() } = {}) {
	// read the config settings from env
	const storageName = env.STORAGE_NAME;
	const storageKey = env.STORAGE_KEY;
	const longTermHash = config.get('longTermHash');
	debug(`Azure Storage name ${storageName} key ${storageKey}`);
	const blobService = azure.createBlobService(storageName, storageKey);
	// promisify all azure methods. (bluebird append Async at the end of the method)
	const bs = promisifyAll(blobService);
	const container = config.getEnsure('projectName', 'Set a valid azureProjectName(container) inside package.json');
	// read again the correct package.json
	const pkg = JSON.parse(await fs.readFileAsync(config.getEnsure('packageJson')));
	const version = pkg.version;
	logger.log(`Upload files to container: ${container} with version: ${version}`);
	// create the project container if not exists
	await bs.createContainerIfNotExistsAsync(container, { publicAccessLevel: 'blob' });
	// check if there's already this version. Avoid this check if we are in longTermHash mode
	if (longTermHash) {
		const blobResult = await bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
		if (blobResult.entries.length > 0) {
			throw new Error(`The version ${version} was already deployed on the azure storage`);
		}
	}


	const filesToUpload = [];
	filesToUpload.push(...(await prepareCssFiles({ buildPathCss: config.get('buildPathCss'), version, longTermHash })));
	filesToUpload.push(...(await prepareJsFiles({ buildPathJs: config.get('buildPathJs'), version, longTermHash })));
	filesToUpload.push(...(await prepareImagesFiles({ imagesPath: config.get('imagesPath') })));
	// logger.log(`Files to upload on container ${container} ${util.inspect(filesToUpload)}`);
	// upload files in parallel
	await Promise.all(
		filesToUpload.map((f) => {
			debug(f.remoteDest, f.file);
			return bs.createBlockBlobFromLocalFileAsync(container, f.remoteDest, f.file);
		}),
	);
}
export const prepareCssFilesAsync = prepareCssFiles;
export const prepareJsFilesAsync = prepareJsFiles;
export const prepareImagesFilesAsync = prepareImagesFiles;
export default upload;
