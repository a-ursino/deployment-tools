/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*
*/

import path from 'path';
import eslint from 'eslint';
import util from 'util';
import c from './libs/config';

const loadConfig = () => c().load();

async function lint(config = loadConfig()) {
	try {
		const CLIEngine = eslint.CLIEngine;
		const cli = new CLIEngine({
			configFile: path.join(process.cwd(), '.eslintrc'),
		});
		const jsFolder = path.join(process.cwd(), config.get('srcJsPath'));
		const eslintReport = cli.executeOnFiles([jsFolder]);
		console.log(util.inspect(eslintReport.results.filter(i => i.errorCount > 0), { showHidden: true, depth: null }));
	}	catch (e) {
		console.error('ERROR', e, e.stack);
	}
}

export default lint;
