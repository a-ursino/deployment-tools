import { getDateString } from './time';

const log = (...message) => console.log(getDateString(), ...message);
const error = (...message) => console.error(getDateString(), ...message);


export default {
	log,
	error,
};
