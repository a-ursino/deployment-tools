require.ensure(['./libs/lib4'], () => {
	const su = require('./libs/lib4'); // eslint-disable-line global-require
	console.log(su.default);
});
require.ensure(['./libs/lib5'], () => {
	const su = require('./libs/lib5'); // eslint-disable-line global-require
	console.log(su.default);
});
