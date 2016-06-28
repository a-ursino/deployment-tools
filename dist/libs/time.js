'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Format a Date Object into HH:MM:SS
 * @param  {Date} time A date object
 * @return {String}      A String formatted date
 */
const format = time => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

/**
 * Format now Date into [HH:MM:SS]
 * @return {String}      A String formatted date
 */
const getDateString = () => `[${ format(new Date()) }] `;

exports.getDateString = getDateString;
exports.format = format;