const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function exportsOptions(initOptions) {
	const defaultOptions = {
		hot: false,
		hash: false,
		debug: false,
		progress: false,
		profile: false,
		bail: false,
		optimize: false,
		saveStats: false,
		failOnError: false,
		banner: false,
	};

	const options = Object.assign(defaultOptions, initOptions || {});

	const loaders = [
		// transpile from ES6 to ES5
		{
			loader: 'babel-loader',
			// Skip any files outside of your project's `src` directory
			/* include: [
				path.resolve(__dirname, 'src'),
			],*/
			// OR
			exclude: /node_modules/,
			// Only run `.js` files through Babel
			test: /\.js?$/,
			// Options to configure babel with
			// the other configurations are inside .babelrc
			query: {
				cacheDirectory: true,
				plugins: ['transform-flow-strip-types', 'transform-object-rest-spread'],
				presets: ['es2015', 'react'],
			},
		},
		{ test: /\.dust$/, loader: 'dust-loader-complete', exclude: /node_modules/, query: { verbose: true } },
	];

	const preLoaders = [
		// lint es6 files
		{ test: /\.(js|jsx)$/, loader: 'eslint-loader', exclude: /(node_modules|vendor)/ },
	];
	const plugins = [
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }, // ("production")
			// NOTE: DO NOT DO like this (this is the check that react do process.env.NODE_ENV !== 'production')
			// uglify remove only if statement with confront with constant, so this one is wrong
			'process.ens': JSON.stringify({ NODE_ENV: process.env.NODE_ENV }), // ({"NODE_ENV":"production"}).NODE_ENV
			VERSION: pkg.version,
			__DEV__: JSON.parse(process.env.NODE_ENV === 'development' || 'false'),
			__PRERELEASE__: JSON.parse(process.env.BUILD_PRERELEASE || 'false'),
		}),
	];

	if (options.hot) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	if (options.optimize) {
		// Minimize all JavaScript output of chunks
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				dead_code: true,
				screw_ie8: false,
				conditionals: true,
			},
		}));
		// plugins.push(new webpack.optimize.DedupePlugin());
		// plugins.push(new webpack.NoErrorsPlugin());
	}

	//	Adds a banner to the top of each generated js files
	if (options.banner) {
		const banner = `Name: ${pkg.name} \nVersion: ${pkg.version}\nAuthor: ${pkg.author}`;
		plugins.push(new webpack.BannerPlugin(banner));
	}
	if (options.progress) {
		// print progress on console
		// this is the native way
		// plugins.push(new webpack.ProgressPlugin((percentage, msg) => console.log(percentage, msg)));
		plugins.push(new ProgressBarPlugin());
	}

	const config = {
		// ENTRY
		entry: {
			// various entry point
		},
		resolve: {
			extensions: ['', '.js'],
			alias: {
				dustjs: 'dustjs-linkedin', // for dustjs loader
				'dust.core': 'dustjs-linkedin',
			},
			modulesDirectories: ['./Scripts/libs/', './node_modules/', './templates/'],
		},
		output: {
			path: path.join(__dirname, '../bundles/'), // output path
			filename: '[name].js', // The filename of the entry chunk (see entry)
			chunkFilename: options.hash ? '[chunkhash].js' : '[name].chunk.js', // The filename of non-entry chunks as relative path inside the output.path directory [id]-[hash]-
			publicPath: 'http://localhost:8080/', // percorso dev altrimenti non funzionano i chunk con VS
			sourceMapFilename: '[name].js.map',
			pathinfo: false,
		},
		externals: {
			// you can use require but the script can be loaded from CDN
			// Loaders are not applied to externals You can (need to) externalize a request with loader: require("bundle!jquery")
			jquery: 'jQuery',
			ga: 'ga',
			Raven: 'Raven',
		},
		module: {
			// PRELOADERS
			preLoaders,
			// LOADERS
			loaders,
		},
		// PLUGINS
		plugins,
		debug: options.debug,
		progress: options.progress,
		profile: options.profile,
		bail: options.bail,
	};

	if (options.devTool) {
		config.devtool = options.devTool;
	}

	return config;
};
