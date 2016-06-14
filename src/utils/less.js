import less from 'less';
import fs from '../libs/fs';
import postcss from 'postcss';
import c from '../libs/config';
import path from 'path';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import url from 'postcss-url';
import logger from '../libs/logger';
// const debug = require('debug')('dt');
const loadConfig = () => c().load();


async function compileLessAsync({ srcFolder, outputFolder, filename, cdnDomain, minify = false, projectName }) {
	// if filename is undefined, skip
	if (filename === undefined) return;
	const filepath = `${srcFolder}${filename}`;
	const lessPath = [];
	// add the folder with the less files
	lessPath.push(path.join(process.cwd(), 'node_modules'));
	lessPath.push(path.join(process.cwd(), srcFolder));
	logger.log(`compile less srcFolder:${srcFolder} outputFolder:${outputFolder} filename:${filename} minify:${minify} path: ${lessPath}`);
	const lessInput = await fs.readFileAsync(filepath);
	const outputCss = await less.render(lessInput, { paths: lessPath, sourceMap: { sourceMapFileInline: false } });
	// es: main.less-> main
	const cssOutputFileName = filename.replace('.less', '');
	// css/main.css
	const cssOutputPath = `${outputFolder}${cssOutputFileName}.css`;
	// const cssMapOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
	const cssMinOutputPath = `${outputFolder}${cssOutputFileName}.min.css`;
	// const cssMinOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
	const cssProcessor = postcss([autoprefixer()]).use(url({
		// transform image url for CDN
		url(imageurl) {
			if (minify) {
				if (!imageurl.startsWith('http')) {
					return imageurl.startsWith('/') ? `${cdnDomain}/${projectName}${imageurl}` : imageurl;
				}
			}
			return imageurl;
		},
	}));
	const processedCssObject = await cssProcessor.process(outputCss.css);
	const outputTask = [
		fs.writeFileAsync(cssOutputPath, processedCssObject.css),
	];
	// enable minify???
	if (minify) {
		const nano = cssnano({ discardComments: { removeAll: true } });
		// make minify via Css-Nano
		const processedMinCssObject = await cssProcessor.use(nano).process(processedCssObject.css);
		outputTask.push(fs.writeFileAsync(cssMinOutputPath, processedMinCssObject.css));
	}

	await Promise.all(outputTask);
}


// cross-env NODE_ENV=production lessc --include-path=node_modules ./less/main.less ./css/main.min.css --clean-css=\"--s1 --advanced --compatibility=ie8\"
async function lessTaskAsync(config = loadConfig(), minify = false) {
	// NOTE: if the srcLess is not set -> skip this task
	if (config.get('srcLess') === undefined) return;
	const srcFolder = config.get('srcLess');
	const outputFolder = config.get('buildPathCss');
	const cdnDomain = config.get('domain');
	const projectName = config.get('projectName');
	const version = config.get('version');
	const tasks = [
		compileLessAsync({ filename: config.get('mainStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version }),
		// the main-backoffice is OPT-IN
		compileLessAsync({ filename: config.get('mainBackoffileStyle'), srcFolder, outputFolder, cdnDomain, minify, projectName, version }),
	];
	await Promise.all(tasks);
}

export default lessTaskAsync;
