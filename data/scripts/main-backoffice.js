require.ensure(['./libs/libTwo'], () => {
	const su = require('./libs/libTwo'); // eslint-disable-line global-require
	console.log(su.default);
});
