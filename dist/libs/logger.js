'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _time = require('./time');

/**
 * Print a message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const log = (...message) => console.log((0, _time.getDateString)(), ...message);

/**
 * Print an error message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const error = (...message) => console.error((0, _time.getDateString)(), ...message);

/**
 * Print a warn message to the console
 * @param  {...object} message An array of object to print
 * @return {void}
 */
const warn = (...message) => console.warn((0, _time.getDateString)(), ...message);

exports.default = {
  log,
  error,
  warn
};