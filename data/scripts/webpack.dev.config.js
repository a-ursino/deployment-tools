const webpackConfig = require('./webpack-config');

module.exports = webpackConfig({
	hot: false,
	hash: false,
	debug: true,
	optimize: false,
	saveStats: false,
	failOnError: false,
	devTool: 'eval',
	banner: false, // false otherwise invalid hash logic
	progress: true,
});
