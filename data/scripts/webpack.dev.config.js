const webpackConfig = require('./webpack-config');

module.exports = webpackConfig({
	hot: false,
	hash: false,
	debug: true,
	optimize: false,
	saveStats: false,
	failOnError: false,
	devTool: 'eval',
	banner: true,
	progress: true,
});
