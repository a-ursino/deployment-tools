const webpackConfig = require('./webpack-config');

module.exports = webpackConfig({
	hot: false,
	hash: true,
	debug: false, // Switch loaders to debug mode.
	optimize: true, // enable UglifyJsPlugin
	progress: true,
	colors: true,
	profile: true, // Capture timing information for each module.
	bail: true, // Report the first error as a hard error instead of tolerating it.
	devTool: 'source-map',
	banner: true,
});
