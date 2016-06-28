import fs from './fs';

// check if we are in dev mode
function isDev() {
	return process.env.DEV || false;
}

/**
 * Create an object from configuration stored inside package.json
 * @param {object} [obj] - obj
 * @param {object} obj.fileSystem - File System
 * @param {string} obj.filename - The name of the file that contains the configuration
 * @param {bool} obj.inDev - Indicate if we are in dev mode
 * @param {object} obj.env - Enviroment variables
 * @return {Promise} A Promise
 */
export default ({ fileSystem = fs, filename = 'package.json', inDev = isDev(), env = process.env.NODE_ENV } = {}) => {
	// Factory function
	// Dependency Injection for easily unit testing and clousure for data privacy
	let store = {}; // eslint-disable-line no-unused-vars
	return Object.assign({}, {
		get type() {
			return 'configJsonObject';
		},
		// load configuration from the file
		load() {
			const content = fileSystem.readFileSync(filename, 'utf8');
			const pkg = JSON.parse(content);
			// if we are in dev mode, merge the two configuration objects so we can override the default values inside config {} with configDev {}
			// otherwise use only the config {}
			const configDev = inDev ? pkg.configDev : {};
			// extract config object from package.json and add version, and production
			const production = env === 'production';
			store = Object.assign({}, pkg.config, configDev, { version: pkg.version, production });
			return this;
		},
		get(key) {
			return key === undefined ? store : store[key];
		},
		getEnsure(key, message) {
			if (key === undefined) {
				throw new Error('Missing parameter key');
			}
			if (store[key] === undefined) {
				throw new Error(message);
			}
			return store[key];
		},
	});
};
