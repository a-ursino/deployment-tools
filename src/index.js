import { prepareJsFilesAsync } from './upload';

async function up() {
	const result = await prepareJsFilesAsync({ longTermHash: true, buildPathCss: '/data/Scripts/' });
	console.log('Result', result);
}

export default up;
