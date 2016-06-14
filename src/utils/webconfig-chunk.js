import fs from '../libs/fs';
// import logger from '../libs/logger';
import find from 'lodash/find';

async function updateWebconfigChunk({ jsLongTermHash = false, webConfig }) {
	// check if config parameter exists. Web.config is OPT-IN
	if (!jsLongTermHash) {
		return false;
	}

	const webpackAssets = await fs.readJsonAsync('wp-assets-stats.json');
	// <add key="vendors" value="" />
	// <add key="main" value="" />
	// <add key="vendors-backoffice" value="" />
	// <add key="main-backoffice" value="" />
	const mainJs = webpackAssets.assetsByChunkName.main ? webpackAssets.assetsByChunkName.main[0] : '';
	const vendorsJs = webpackAssets.assetsByChunkName.vendors ? webpackAssets.assetsByChunkName.vendors[0] : '';
	const mainBackofficeJs = webpackAssets.assetsByChunkName['main-backoffice'] ? webpackAssets.assetsByChunkName['main-backoffice'][0] : '';
	const vendorsBackofficeJs = webpackAssets.assetsByChunkName['vendors-backoffice'] ? webpackAssets.assetsByChunkName['vendors-backoffice'][0] : '';

	const modernizr = find(webpackAssets.assets, (i) => i.name.indexOf('modernizr') >= 0);
	const modernizrJs = modernizr ? modernizr.name : '';

	const xmlString = await fs.readFileAsync(webConfig);
	let newWebconfigXmlString = xmlString.replace(/<add .*"vendors".*\/>/igm, `<add key="vendors" value="${webpackAssets.publicPath}${vendorsJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main".*\/>/igm, `<add key="main" value="${webpackAssets.publicPath}${mainJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"vendors-backoffice".*\/>/igm, `<add key="vendors-backoffice" value="${webpackAssets.publicPath}${vendorsBackofficeJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main-backoffice".*\/>/igm, `<add key="main-backoffice" value="${webpackAssets.publicPath}${mainBackofficeJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"modernizr".*\/>/igm, `<add key="modernizr" value="${webpackAssets.publicPath}${modernizrJs}" />`);
	return fs.writeFileAsync(webConfig, newWebconfigXmlString);
}

export default updateWebconfigChunk;
