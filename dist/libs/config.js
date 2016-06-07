'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require('./fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check if we are in dev mode
function isDev() {
	return process.env.DEV || false;
}

// Factory function
// Dependency Injection for easily unit testing and clousure for data privacy

exports.default = ({ fileSystem = _fs2.default, filename = 'package.json', inDev = isDev(), env = process.env.NODE_ENV } = {}) => {
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
		}
	});
};