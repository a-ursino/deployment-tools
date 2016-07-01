import bump from './bump';
import build from './build';
import upload from './upload';
import webconfigChunk from './utils/webconfig-chunk';
import c from './libs/config';

/**
 * Upload JavaScript, Css and images to storage.
 * This task could be called directly
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run deploy
 */
async function deploy() {
	// update package.json and web.config version
	const config = c().load();
	const cdn = config.get('cdn');
	const longTermHash = config.get('longTermHash');
	const projectName = config.get('projectName');
	const buildPathCss = config.get('buildPathCss');
	const webConfigFile = config.get('webConfig');
	await bump(config);
	// build (clean, build)
	await build(config);
	// update web.config
	await webconfigChunk({ longTermHash, webConfigFile, cdn, projectName, buildPathCss });
	// upload to azure storage
	await upload({ config });
}

export default deploy;
