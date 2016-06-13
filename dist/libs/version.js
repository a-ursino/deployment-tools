'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Increment the string version accorging semver
 * @param  {String} newVersionType A string that contains the new version type
 * @param  {String} version        The actual version
 * @return {String}                The new version accorging to newVersionType
 */
function getNewVersion(newVersionType, version) {
  if (newVersionType !== 'patch' && newVersionType !== 'minor' && newVersionType !== 'major') {
    throw new Error('Use a valid version type between patch, minor, major');
  }
  // npm --no-git-tag-version version. this update package.json directly
  return _semver2.default.inc(version, newVersionType);
}

exports.default = getNewVersion;