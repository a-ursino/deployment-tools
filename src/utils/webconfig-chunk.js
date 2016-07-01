import fs from '../libs/fs';
import find from 'lodash/find';

/**
 * Update web.config with webpackManifest, CSS and JS files hash.
 * @param {object} [obj] - obj
 * @param {object} [obj.longTermHash] - Return if long term hash is false
 * @param {string} obj.webConfig - Relative path of webconfig
 * @param {string} obj.cdn - The CDN domain
 * @param {string} obj.projectName - The project name
 * @param {string} obj.buildPathCss - The CSS build Path
 * @return {Promise} A Promise
 */
async function updateWebconfigChunk({ longTermHash = false, webConfigFile, cdn, projectName, buildPathCss }) {
	// check if config parameter exists. Web.config is OPT-IN
	if (!longTermHash) {
		return false;
	}
	// TODO: make this parallel
	const webpackAssets = await fs.readJsonAsync('wp-assets-stats.json');
	const css = await fs.readJsonAsync('css-assets-stats.json');
	const xmlString = await fs.readFileAsync(webConfigFile);
	// <add key="vendors" value="" />
	// <add key="main" value="" />
	// <add key="vendors-backoffice" value="" />
	// <add key="main-backoffice" value="" />
	// <add key="main.css" value="" />
	// <add key="main-admin.css" value="" />
	// <add key="webpackManifest" value="" />
	const mainJs = webpackAssets.assetsByChunkName.main ? webpackAssets.assetsByChunkName.main[0] : '';
	const vendorsJs = webpackAssets.assetsByChunkName.vendors ? webpackAssets.assetsByChunkName.vendors[0] : '';
	const mainBackofficeJs = webpackAssets.assetsByChunkName['main-backoffice'] ? webpackAssets.assetsByChunkName['main-backoffice'][0] : '';
	const vendorsBackofficeJs = webpackAssets.assetsByChunkName['vendors-backoffice'] ? webpackAssets.assetsByChunkName['vendors-backoffice'][0] : '';

	const modernizr = find(webpackAssets.assets, (i) => i.name.indexOf('modernizr') >= 0);
	const modernizrJs = modernizr ? modernizr.name : '';

	const mainCss = find(css.assets, (i) => i.filename.indexOf('main.css') >= 0);
	const mainAdminCss = find(css.assets, (i) => i.filename.indexOf('main-admin.css') >= 0);
	const jsRemotePath = webpackAssets.publicPath;
	const cssRemotePath = `${cdn}/${projectName}${buildPathCss}`;
	const webpackManifest = {};
	// take only js files (exclude .map files)
	webpackAssets.assets.filter((i) => i.name.match('.js$') !== null).forEach((item) => { webpackManifest[item.chunks[0]] = item.name; });

	let newWebconfigXmlString = xmlString.replace(/<add .*"vendors".*\/>/igm, `<add key="vendors" value="${jsRemotePath}${vendorsJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main".*\/>/igm, `<add key="main" value="${jsRemotePath}${mainJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"vendors-backoffice".*\/>/igm, `<add key="vendors-backoffice" value="${jsRemotePath}${vendorsBackofficeJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main-backoffice".*\/>/igm, `<add key="main-backoffice" value="${jsRemotePath}${mainBackofficeJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"modernizr".*\/>/igm, `<add key="modernizr" value="${jsRemotePath}${modernizrJs}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main\.css".*\/>/igm, `<add key="main.css" value="${cssRemotePath}${mainCss.filename.replace(/\.css$/, '.')}${mainCss.filehash}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"main-admin\.css".*\/>/igm, `<add key="main-admin.css" value="${cssRemotePath}${mainAdminCss.filename.replace(/\.css$/, '.')}${mainAdminCss.filehash}" />`);
	newWebconfigXmlString = newWebconfigXmlString.replace(/<add .*"webpackManifest".*\/>/igm, `<add key="webpackManifest" value='${JSON.stringify(webpackManifest)}' />`);
	return fs.writeFileAsync(webConfigFile, newWebconfigXmlString);
}

export default updateWebconfigChunk;
