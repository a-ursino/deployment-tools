import { getDateString } from './time';

/**
 * Print a message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const log = (...message) => console.log(getDateString(), ...message);

/**
 * Print an error message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const error = (...message) => console.error(getDateString(), ...message);

/**
 * Print a warn message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const warn = (...message) => console.warn(getDateString(), ...message);


export default {
	log,
	error,
	warn,
};
