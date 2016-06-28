require.ensure(['./libs/lib1'], () => {
	const su = require('./libs/lib1'); // eslint-disable-line global-require
	console.log(su.default);
});
require.ensure(['./libs/lib2'], () => {
	const su = require('./libs/lib2'); // eslint-disable-line global-require
	console.log(su.default);
});
require.ensure(['./libs/lib3'], () => {
	const su = require('./libs/lib3'); // eslint-disable-line global-require
	console.log(su.default);
});
