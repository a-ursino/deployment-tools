const webpackConfig = require('./webpack-config');

module.exports = webpackConfig({
	hot: false,
	// Don’t use [chunkhash] in development since this will increase compilation time
	hash: false,
	debug: true,
	optimize: false,
	saveStats: false,
	failOnError: false,
	devTool: 'eval',
	banner: false, // false otherwise invalid hash logic
	progress: true,
});
