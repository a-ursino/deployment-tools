'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.execAsync = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
*
* Copyright © 2014-2016 killanaca All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*/

const execAsync = (0, _bluebird.promisify)(_child_process2.default.exec);

exports.execAsync = execAsync;