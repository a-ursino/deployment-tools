const modernizrconfig = {
	filename: 'modernizr.[hash].js',
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
