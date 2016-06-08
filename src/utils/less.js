import less from 'less';
import fs from '../libs/fs';
import postcss from 'postcss';
import c from '../libs/config';
import path from 'path';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import logger from '../libs/logger';
const debug = require('debug')('dt');
const loadConfig = () => c().load();


async function compileLessAsync(srcFolder, outputFolder, filename, minify = false) {
	// if filename is undefined, skip
	if (filename === undefined) return;
	const filepath = `${srcFolder}${filename}`;
	const lessPath = [];
	// add the folder with the less files
	lessPath.push(path.join(process.cwd(), 'node_modules'));
	lessPath.push(path.join(process.cwd(), srcFolder));
	logger.log(`compile less srcFolder:${srcFolder} outputFolder:${outputFolder} filename:${filename} minify:${minify} path: ${lessPath}`);
	const lessInput = await fs.readFileAsync(filepath);
	const outputCss = await less.render(lessInput, { paths: lessPath, sourceMap: { sourceMapFileInline: true } });
	// es: main.less-> main
	const cssOutputFileName = filename.replace('.less', '');
	// css/main.css
	const cssOutputPath = `${outputFolder}${cssOutputFileName}.css`;
	// const cssMapOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
	const cssMinOutputPath = `${outputFolder}${cssOutputFileName}.min.css`;
	// const cssMinOutputPath = `${pkg.staticAssets.css}${cssOutputFileName}.css.map`;
	const cssProcessor = postcss([autoprefixer()]);
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
	// if the srcLess is not set -> skip this task
	if (config.get('srcLess') === undefined) return;

	const tasks = [
		compileLessAsync(config.get('srcLess'), config.get('buildPathCss'), config.get('mainStyle'), minify),
		// the main-backoffice is OPT-IN
		compileLessAsync(config.get('srcLess'), config.get('buildPathCss'), config.get('mainBackoffileStyle'), minify),
	];
	await Promise.all(tasks);
}

export default lessTaskAsync;
