
import lessTask from './utils/less';
import c from './libs/config';

const loadConfig = () => c().load();

async function less(config = loadConfig()) {
	try {
		await lessTask(config, true);
	} catch (e) {
		console.error(e); // eslint-disable-line no-console
	}
}

export default less;
