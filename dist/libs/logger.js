'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _time = require('./time');

const log = (...message) => console.log((0, _time.getDateString)(), ...message);
const error = (...message) => console.error((0, _time.getDateString)(), ...message);
const warn = (...message) => console.warn((0, _time.getDateString)(), ...message);

exports.default = {
	log,
	error,
	warn
};