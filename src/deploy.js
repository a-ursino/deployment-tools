import bump from './bump';
import build from './build';
import upload from './upload';
import webconfigChunk from './utils/webconfig-chunk';
import c from './libs/config';

async function deploy() {
	// update package.json and web.config version
	const config = c().load();
	await bump(config);
	// build (clean, build)
	await build(config);
	// update web.config
	await webconfigChunk({ webConfig: config.get('webConfig'), longTermHash: config.get('longTermHash') });
	// upload to azure storage
	await upload(config);
}

export default deploy;
