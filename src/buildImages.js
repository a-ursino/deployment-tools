import trimEnd from 'lodash/trimEnd';
import c from './libs/config';
import clean from './clean';
import path from 'path';
import imageminTask from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import logger from './libs/logger';
const debug = require('debug')('dt');

const loadConfig = () => c().load();

async function buildImages({ config = loadConfig(), cleaned = false } = {}) {
	// we must clean??
	if (!cleaned) await clean(config);
	// copy image to temp folder
	if (!config.get('imagesPath')) {
		return;
	}
	const srcPath = path.join(process.cwd(), config.get('imagesPath'));
	const srcPathGlob = `${srcPath}**/*.{jpg,png,gif,svg}`;
	// normalize path. remove the trailing slash from /data/images/ -> /data/images
	const dstPath = path.join(process.cwd(), `${trimEnd(config.get('imagesPath'), '/')}-temp`);
	debug(`try to minify images from ${srcPathGlob} to ${dstPath}`);
	const files = await imageminTask([srcPathGlob], dstPath, {
		plugins: [
			imageminMozjpeg({ targa: false }),
			imageminPngquant({ quality: '65-80' }),
			imageminGifsicle(),
		],
	});
	logger.log('minified images', files.map((o) => o.path).join(' , '));
}

export default buildImages;
