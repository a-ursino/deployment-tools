import { promisifyAll } from 'bluebird';
import azure from 'azure-storage';
import logger from './libs/logger';
import fs from './libs/fs';

const debug = require('debug')('dt');

const envalid = require('envalid');
const { str } = envalid;
const env = envalid.cleanEnv(process.env, {
	STORAGE_NAME: str(),
	STORAGE_KEY: str(),
});

/**
 * Configure CORS settings for Azure Storage. You can change the settings using azure-storage-settings.json file.
 * We use the the azure remote service as data validator, so if there is something wrong in the settings we display the error in the response.
 * This task could be called directly
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run azureStorage
 */
async function azureStorage() {
	// read the config settings from env
	const storageName = env.STORAGE_NAME;
	const storageKey = env.STORAGE_KEY;
	debug(`Azure Storage name ${storageName} key ${storageKey}`);
	// read the azure settings from json file
	const azureSettings = await fs.readJsonAsync('azure-storage-settings.json');
	const blobService = azure.createBlobService(storageName, storageKey);
	// NOTE: promisify all azure methods. (bluebird append Async at the end of the method)
	const bs = promisifyAll(blobService);
	const remoteSettings = await bs.getServicePropertiesAsync();
	const newSettings = Object.assign({}, azureSettings, remoteSettings);
	logger.log(`The new Azure Storage settings are: ${newSettings}`);
	const response = await bs.setServicePropertiesAsync(newSettings);
	logger.log(`The Azure Storage service response: ${response}`);
}


export default azureStorage;
