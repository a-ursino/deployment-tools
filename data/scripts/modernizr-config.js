const modernizrconfig = {
	filename: process.NODE_ENV === 'production' ? 'modernizr.[hash].js' : 'modernizr-bundle.js',
	'feature-detects': [
		'touchevents',
		'history',
	],
	options: [
		'html5shiv',
		'teststyles',
		'prefixes',
		'setClasses', // to remove no-js class
	],
};

module.exports = modernizrconfig;
