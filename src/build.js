import c from './libs/config';
import clean from './clean';
import buildJS from './buildJs';
import buildCss from './buildCss';
import buildImages from './buildImages';


/**
 * Build js, css, images.
 * This task could be called directly
 * @return {Promise} A Promise
 * @example <caption>run this on your terminal</caption>
 * node src/run build
 */
async function build() {
	const config = c().load();
	// clean folder
	await clean({ config });
	// compile css, js, image files in parallel
	return Promise.all([
		buildJS({ config, cleaned: true }),
		buildCss({ config, cleaned: true }),
		buildImages({ config, cleaned: true }),
	]);
}

export default build;
