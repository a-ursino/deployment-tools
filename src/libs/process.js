/* eslint-disable import/prefer-default-export */
import cp from 'child_process';
import { promisify } from 'bluebird';

const execAsync = promisify(cp.exec);

export {
	execAsync,
};
