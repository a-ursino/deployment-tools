/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import fs from './lib/fs';
import path from 'path';
import compact from 'lodash/compact';
// import run from './run';
// import { execAsync } from './lib/process';
import eslint from 'eslint';
import util from 'util';

async function lint() {
	try {
		const pkg = JSON.parse(await fs.readFileAsync('package.json'));
		// use configuration inside dev (for development)
		const dev = process.env.Dev || false;
		const distFolder = [];
		// use empty string when the config value isn't set to take advantage of lodash compact
		if (dev) {
			distFolder.push(pkg.config.dev.jsPath === undefined ? '' : path.join(process.cwd(), pkg.config.dev.jsPath));
		} else {
			distFolder.push(pkg.config.jsPath === undefined ? '' : path.join(process.cwd(), pkg.config.jsPath));
		}
		// compact the array
		const distFolderCompacted = compact(distFolder);
		console.log(distFolderCompacted);
		// const lintTask = execAsync.bind(null, 'eslint src'); // ``
		// await run(lintTask);
		const CLIEngine = eslint.CLIEngine;
		const cli = new CLIEngine({
			configFile: path.join(process.cwd(), '.eslintrc'),
		});
		const eslintReport = cli.executeOnFiles(['src']);
		console.log(util.inspect(eslintReport.results.filter(i => i.errorCount > 0), { showHidden: true, depth: null }));
		// await execAsync('eslint src');
	}	catch (e) {
		console.error('ERROR', e, e.stack);
	}
}

export default lint;
