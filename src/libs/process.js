/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*/

import cp from 'child_process';
import { promisify } from 'bluebird';

const execAsync = promisify(cp.exec);

export {
	execAsync,
};
