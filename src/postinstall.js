import { promisify } from 'bluebird';
import ncp from 'ncp';
import del from 'del';
import path from 'path';
import logger from './libs/logger';

/**
 * Copy JavaScript files inside tools folder after installation
 * This task could be called directly
 * @return {Promise} A Promise
 */
async function postinstall() {
	const ncpAsync = promisify(ncp);
	// this is the path of the package: ..../node_modules/deployment-tools
	const packagePath = process.cwd();
	const src = path.join(packagePath, 'dist');
	const projectPath = path.join(packagePath, '../../');
	const destPath = path.join(projectPath, 'tools');
	logger.log(`[postinstall] try to copy files from src:${src} to destPath:${destPath}`);
	// first delete folder
	await del(destPath, { dot: true, dryRun: true, force: true });
	// then copy dist into projects tools folder
	await ncpAsync(src, destPath);
	logger.log(`[postinstall] copied files from src:${src} to destPath:${destPath}`);
}

export default postinstall;
