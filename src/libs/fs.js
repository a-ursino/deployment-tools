import fs from 'fs';
import mkdirp from 'mkdirp';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { promisify } from 'bluebird';
import path from 'path';
const debug = require('debug')('dt');

// NOTE: Promise.promisify takes a function that takes a callback as its last argument and converts it into a function that returns a promise (without the need for a callback)
const makeDirAsync = promisify(mkdirp);
const fileExistsPromise = promisify(fs.access);

// OR with promisify.fromCallback
// const readFileAsync = (file) => promisify.fromCallback(cb => fs.readFile(file, 'utf8', cb));
// OR
// const readFileAsync = new Promise((resolve, reject) => {
// 	fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data)); // eslint-disable-line no-confusing-arrow
// });

async function writeFileAsync(filepath, content) {
	const writeFilep = promisify(fs.writeFile);
	const fullPath = path.join(process.cwd(), filepath);
	debug(`[FS] try to write a file at path ${fullPath}`);
	return await writeFilep(fullPath, content);
}

function writeAsync(filepath, content) {
	const writeFilep = promisify(fs.writeFile);
	const fullPath = path.join(process.cwd(), filepath);
	debug(`[FS] try to write a file at path ${fullPath}`);
	return writeFilep(fullPath, content);
}

async function readFileAsync(filepath) {
	const readFilep = promisify(fs.readFile);
	const fullPath = path.join(process.cwd(), filepath);
	debug(`[FS] try to read a file at path ${fullPath}`);
	return await readFilep(fullPath, 'utf8');
}

async function readJsonAsync(filepath) {
	const content = await readFileAsync(filepath);
	const contentJson = JSON.parse(content);
	return contentJson;
}

/**
 * Check if a file exists on the specified path
 * Is an async function, it makes its promise. Any uncaught exception inside it becomes a rejection of that promise
 * @param  {String} filepath The filepath
 * @return {Boolean}      true if the file exists, false otherwise
 */
async function fileExistsAsync(filepath) {
	const fullPath = path.join(process.cwd(), filepath);
	debug(`[FS] check if file filepath:${filepath} fullPath:${fullPath} exists`);
	try {
		// fs.access throws an exception if the file doesn't exists.
		// so we can return false
		await fileExistsPromise(fullPath, fs.R_OK);
		return true;
	} catch (e) {
		return false;
	}
}

/**
* Create folder(s) from a string path or an array of string path
* @param  {String|Array} paths a string path or an array of string path
* @return {Promise}      The promise object that is resolved when all the files are created
*/
const makeDirsAsync = (paths) => {
	if (isString(paths)) {
		return makeDirAsync(paths);
	} else if (isArray(paths)) {
		return Promise.all(paths.map(i => makeDirAsync(i)));
	}
	throw new Error(`Invalid parameter name  ${name}. It must be a string or an array`);
};

export default {
	writeAsync,
	writeFileAsync,
	writeFileSync: fs.writeFileSync,
	readFileAsync,
	readJsonAsync,
	readFileSync: fs.readFileSync,
	makeDirsAsync,
	fileExistsAsync,
};
