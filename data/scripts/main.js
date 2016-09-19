/* eslint-disable global-require */

const project = {
	common: {
		init() {

		},
		finalize() {
			// called only from page with main-content/data-controller set
		},
	},
	// new i miei servizi page
	homePage: {
		init() {
			require.ensure(['./libs/configPage/homepage'], () => {
				const su = require('./libs/configPage/homepage');

				su.default();
			});
		},
	},
};

const UTIL = {
	fire(func, funcname, args) {
		const namespace = project; // indicate your obj literal namespace here
		/* eslint-disable no-param-reassign*/
		funcname = (funcname === undefined) ? 'init' : funcname;
		/* eslint-enable no-param-reassign*/
		if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
			namespace[func][funcname](args);
		}
	},
	loadEvents() {
		// hit up common first.
		UTIL.fire('common');
		/* eslint-disable no-undef*/
		const mainContent = document.getElementById('main-content');
		if (mainContent === 'undefined' || mainContent === null) {
			return;
		}
		const controller = mainContent.getAttribute('data-controller');
		if (controller !== '') {
			UTIL.fire(controller);
		}
		UTIL.fire('common', 'finalize');
	},
};

UTIL.loadEvents();
