'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let up = (() => {
	var ref = _asyncToGenerator(function* () {
		const result = yield (0, _upload.prepareJsFilesAsync)({ longTermHash: true, buildPathCss: '/data/Scripts/' });
		console.log('Result', result);
	});

	return function up() {
		return ref.apply(this, arguments);
	};
})();

var _upload = require('./upload');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = up;