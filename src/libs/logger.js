import { getDateString } from './time';

const log = (...message) => console.log(getDateString(), ...message);
const error = (...message) => console.error(getDateString(), ...message);
const warn = (...message) => console.warn(getDateString(), ...message);


export default {
	log,
	error,
	warn,
};
