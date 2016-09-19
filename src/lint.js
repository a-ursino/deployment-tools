/* eslint-disable require-yield */
import path from 'path';
import eslint from 'eslint';
import util from 'util';
import c from './libs/config';
import logger from './libs/logger';

const loadConfig = () => c().load();

/**
 * Lint JavaScript files
 * This task could be called directly
 * @param {object} [obj] - obj
 * @param {object} obj.config - The config Object
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run lint
 */
async function lint({ config = loadConfig() } = {}) {
	try {
		const CLIEngine = eslint.CLIEngine;
		const cli = new CLIEngine({
			configFile: path.join(process.cwd(), config.get('srcJsPath'), '.eslintrc'),
		});
		const jsFolder = path.join(process.cwd(), config.get('srcJsPath'));
		const eslintReport = cli.executeOnFiles([jsFolder]);
		const reportResult = eslintReport.results.filter(i => i.errorCount > 0);
		if (reportResult.length) {
			logger.error('EsLint Error', util.inspect(reportResult, { showHidden: true, depth: null }));
		}
	}	catch (e) {
		logger.error('ERROR', e, e.stack);
	}
}

export default lint;
