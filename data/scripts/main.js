require.ensure(['./libs/libOne'], () => {
	const su = require('./libs/libOne'); // eslint-disable-line global-require
	console.log(su.default);
});
