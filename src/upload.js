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

async function upload(config = loadConfig()) {
	try {
		const storageName = process.env.STORAGE_NAME;
		const storageKey = process.env.STORAGE_KEY;
		debug(`Azure Storage name ${storageName} key ${storageKey}`);
		const blobService = azure.createBlobService(storageName, storageKey);
		// promisify all azure methods. (append Async at the end of the method)
		const bs = promisifyAll(blobService);

		const container = config.getEnsure('projectName', 'Set a valid azureProjectName(container) inside package.json');
		// read again the correct package.json
		const pkg = JSON.parse(await fs.readFileAsync(config.getEnsure('packageJson')));
		const version = pkg.version;
		logger.log(`Upload files to container: ${container} with version: ${version}`);
		// create the project folder if not exists
		await bs.createContainerIfNotExistsAsync(container, { publicAccessLevel: 'blob' });
		// check if there is already this version
		const blobResult = await bs.listBlobsSegmentedWithPrefixAsync(container, version, null);
		if (blobResult.entries.length > 0) {
			throw new Error(`The version ${version} was already deployed on the azure storage`);
		}

		const filesToUpload = [];
		const buildPathJs = config.get('buildPathJs');
		const buildPathCss = config.get('buildPathCss');
		// js?
		if (buildPathJs !== '') {
			const jsFiles = await recDir(path.join(process.cwd(), buildPathJs));
			debug(`Upload js files ${jsFiles} from path ${buildPathJs}`);
			// Merge the second array into the first one
			// Array.prototype.push.apply(filesToUpload, jsFiles);
			// from apply to spread operator
			filesToUpload.push(...jsFiles);
		}
		// css?
		if (buildPathCss !== '') {
			const cssFiles = await recDir(path.join(process.cwd(), buildPathCss));
			debug(`Upload css files ${cssFiles} from path ${buildPathCss}`);
			// Merge the second array into the first one
			// Array.prototype.push.apply(filesToUpload, cssFiles);
			// from apply to spread operator
			filesToUpload.push(...cssFiles);
		}
		logger.log(`Files to upload ${filesToUpload}`);
		// upload files in parallel
		await Promise.all(
			filesToUpload.map((i) => bs.createBlockBlobFromLocalFileAsync(container, `${version}/${path.relative(process.cwd(), i)}`, i)),
		);
	} catch (e) {
		logger.error('upload', e);
	}
}

export default upload;
