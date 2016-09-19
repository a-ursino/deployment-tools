'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.execAsync = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export */
const execAsync = (0, _bluebird.promisify)(_child_process2.default.exec);

exports.execAsync = execAsync;