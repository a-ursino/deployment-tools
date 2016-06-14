import c from './libs/config';
import clean from './clean';
import buildJS from './buildJs';
import imagemin from './imagemin';
import buildLess from './buildLess';

async function build() {
	const config = c().load();
	// clean folder
	await clean(config);
	// compile js files
	await Promise.all([
		buildJS(config),
		buildLess(config),
		imagemin(config),
	]);
}

export default build;
