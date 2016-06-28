import fs from './fs';
import logger from './logger';
import getNewVersion from './version.js';

/**
 * Increment version inside package.json file according to a category
 * @param  {String} category It must be a value between patch, minor, major
 * @param  {Object} pkg The package.json object loaded into memory
 * @param  {Object} config The config object (from package.json)
 * @return {Promise}         The promise
 */
async function updatePackageJson(category, pkg, config) {
	const packageJson = config.get('packageJson');
	if (!packageJson) {
		return false;
	}
	// check if file exists
	const exists = await fs.fileExistsAsync(packageJson);
	if (!exists) {
		logger.error('updatePackageJson file not found', packageJson);
		return false;
	}
	const newVersion = getNewVersion(category, pkg.version);
	logger.log(`Update package.json from ${pkg.version} to ${newVersion}`);
	const newPackageJson = Object.assign({}, pkg, { version: newVersion });
	// write the package.json updated and return a promise
	return fs.writeFileAsync(packageJson, JSON.stringify(newPackageJson, null, 2));
}

/**
* [updateWebconfig description]
* Is an async function, it makes its promise. Any uncaught exception inside it becomes a rejection of that promise
* @param  {String} category It must be a value between patch, minor, major
* @param  {Object} pkg The package.json object
* @param  {Object} config The configuration Object from package.json
* @return {Promise} The promise
*/
async function updateWebconfig(category, pkg, config) {
	// check if config parameter exists. Web.config is OPT-IN
	const webConfig = config.get('webConfig');
	if (!webConfig) {
		// immediate values are implicitly wrapped in an already-resolved promise, which is then awaited.
		// await automatically promise-wraps any non-promise values and since the value is a non-promise, the wrapped promise will immediately resolve
		// unwrapping is an async step, so we have to wait a tick before we can get that value
		// _context.abrupt('return', _context.sent)
		return await false;
	}
	// check if file exists. Web.config is OPT-IN
	const exists = await fs.fileExistsAsync(webConfig);
	if (!exists) {
		logger.error('updateWebconfig file not found', webConfig);
		return false;
	}
	const newVersion = getNewVersion(category, pkg.version);
	const xmlString = await fs.readFileAsync(webConfig);
	const newWebconfigXmlString = xmlString.replace(/<add .*"swversion".*\/>/igm, `<add key="swversion" value="${newVersion}" />`);
	return fs.writeFileAsync(webConfig, newWebconfigXmlString);
}

export default {
	getNewVersion,
	updatePackageJson,
	updateWebconfig,
};
