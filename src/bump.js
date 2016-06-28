import fu from './libs/files-utils';
import pkg from '../package.json';
import c from './libs/config';

/**
 * Upgrade version inside package.json and web.config ([OPT-IN]) according semver.
 * This task could be called directly
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run bump
 */
async function bump() {
	const config = c().load();
	const versionRequest = process.argv[process.argv.length - 1];
	// update package.json and web.config(OPT-IN) in parallel
	await Promise.all([
		fu.updatePackageJson(versionRequest, pkg, config),
		fu.updateWebconfig(versionRequest, pkg, config),
	]);
}

export default bump;
