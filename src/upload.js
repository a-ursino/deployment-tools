/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import { promisify, promisifyAll } from 'bluebird';
import azure from 'azure-storage';
import c from './libs/config';
import logger from './libs/logger';
import recursive from 'recursive-readdir';
import path from 'path';
import fs from './libs/fs';

require('dotenv').config();
const debug = require('debug')('dt');
const recDir = promisify(recursive);

const loadConfig = () => c().load();

async function prepareCssFiles({ buildPathCss, version }) {
	if (buildPathCss !== '') {
		// get all the files paths from source
		const cssFiles = await recDir(path.join(process.cwd(), buildPathCss));
		debug(`Upload css files ${cssFiles} from path ${buildPathCss}`);
		// css files on storage: 5.2.8/css/main.css
		// css files with versioning
		const f = cssFiles.map((i) => ({ file: i, remoteDest: `${version}/${path.relative(process.cwd(), i)}` }));
		return f;
	}
	return [];
}

async function prepareJsFiles({ buildPathJs, version }) {
	// js?
	if (buildPathJs !== '') {
		const jsFiles = await recDir(path.join(process.cwd(), buildPathJs));
		debug(`Upload js files ${jsFiles} from path ${buildPathJs}`);
		// js files on storage: 5.2.8/bundles/main.js
		// js files with versioning
		const f = jsFiles.map((i) => ({ file: i, remoteDest: `${version}/${path.relative(process.cwd(), i)}` }));
		return f;
	}
	return [];
}

async function prepareImagesFiles({ imagesPath }) {
	if (imagesPath !== '') {
		// read images from temp path not the source one
		const src = path.join(process.cwd(), imagesPath);
		const files = await recDir(src);
		debug(`Upload images files ${files} from path ${imagesPath}`);
		// images files on storage: images/background.png
		// images files without versioning
		// the images are inside folder temp folder (images-temp) but goes inside imagesPath /images/
		// remove the first / otherwise an empty folder is created on storage
		const dest = imagesPath.substr(1);
		const f = files.map((i) => ({ file: i, remoteDest: `${dest}${path.basename(i)}` }));
		return f;
	}
	return [];
}

async function upload(config = loadConfig()) {
	try {
		// read the config settings from env
		const storageName = process.env.STORAGE_NAME;
		const storageKey = process.env.STORAGE_KEY;
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
		// check if there is already this version
		const blobResult = await bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
		if (blobResult.entries.length > 0) {
			throw new Error(`The version ${version} was already deployed on the azure storage`);
		}

		const filesToUpload = [];
		filesToUpload.push(...(await prepareCssFiles({ buildPathCss: config.get('buildPathCss'), version })));
		filesToUpload.push(...(await prepareJsFiles({ buildPathJs: config.get('buildPathJs'), version })));
		filesToUpload.push(...(await prepareImagesFiles({ imagesPath: config.get('imagesPath') })));

		// logger.log(`Files to upload on container ${container} ${util.inspect(filesToUpload)}`);
		// upload files in parallel
		await Promise.all(
			filesToUpload.map((f) => {
				debug(f.remoteDest, f.file);
				return bs.createBlockBlobFromLocalFileAsync(container, f.remoteDest, f.file);
			}),
		);
	} catch (e) {
		logger.error('upload', e);
	}
}

export default upload;
