'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let updateWebconfigChunk = (() => {
	var ref = _asyncToGenerator(function* ({ jsLongTermHash = false, webConfig }) {
		// check if config parameter exists. Web.config is OPT-IN
		if (!jsLongTermHash) {
			return false;
		}

		const webpackAssets = yield _fs2.default.readJsonAsync('wp-assets-stats.json');
		// <add key="vendors" value="" />
		// <add key="main" value="" />
		// <add key="vendors-backoffice" value="" />
		// <add key="main-backoffice" value="" />
		const mainJs = webpackAssets.assetsByChunkName.main ? webpackAssets.assetsByChunkName.main[0] : '';
		const vendorsJs = webpackAssets.assetsByChunkName.vendors ? webpackAssets.assetsByChunkName.vendors[0] : '';
		const mainBackofficeJs = webpackAssets.assetsByChunkName['main-backoffice'] ? webpackAssets.assetsByChunkName['main-backoffice'][0] : '';
		const vendorsBackofficeJs = webpackAssets.assetsByChunkName['vendors-backoffice'] ? webpackAssets.assetsByChunkName['vendors-backoffice'][0] : '';

		const modernizr = (0, _find2.default)(webpackAssets.assets, function (i) {
			return i.name.indexOf('modernizr') >= 0;
		});
		const modernizrJs = modernizr ? modernizr.name : '';

		const xmlString = yield _fs2.default.readFileAsync(webConfig);
		let newWebconfigXmlString = xmlString.replace(/<add .*"vendors".*\/>/igm, `<add key="vendors" value="${ webpackAssets.publicPath }${ vendorsJs }" />`);
		newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main".*\/>/igm, `<add key="main" value="${ webpackAssets.publicPath }${ mainJs }" />`);
		newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"vendors-backoffice".*\/>/igm, `<add key="vendors-backoffice" value="${ webpackAssets.publicPath }${ vendorsBackofficeJs }" />`);
		newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main-backoffice".*\/>/igm, `<add key="main-backoffice" value="${ webpackAssets.publicPath }${ mainBackofficeJs }" />`);
		newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"modernizr".*\/>/igm, `<add key="modernizr" value="${ webpackAssets.publicPath }${ modernizrJs }" />`);
		return _fs2.default.writeFileAsync(webConfig, newWebconfigXmlString);
	});

	return function updateWebconfigChunk(_x) {
		return ref.apply(this, arguments);
	};
})();

var _fs = require('../libs/fs');

var _fs2 = _interopRequireDefault(_fs);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
// import logger from '../libs/logger';


exports.default = updateWebconfigChunk;