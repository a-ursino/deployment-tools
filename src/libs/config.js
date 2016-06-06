import fs from './fs';

// check if we are in dev mode
function isDev() {
	return process.env.DEV || false;
}

// Factory function
// Dependency Injection and clousure for easily unit testing
export default (fileSystem = fs, filename = 'package.json') => {
	let store = {}; // eslint-disable-line no-unused-vars
	return Object.assign({}, {
		get type() {
			return 'configJsonObject';
		},
		load() {
			const content = fileSystem.readFileSync(filename, 'utf8');
			const pkg = JSON.parse(content);
			// if we are in dev mode, merge the two configuration objects so we can override the default values inside config {} with configDev {}
			// otherwise use only the config {}
			const configDev = isDev() ? pkg.configDev : {};
			// extract config object from package.json and add version, and production
			const production = process.env.NODE_ENV === 'production';
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
