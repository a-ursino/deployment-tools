import c from './src/libs/config';
import { stub } from 'sinon';

const mockFs = {
	readFileSync: stub().returns(JSON.stringify({ config: { domain: 2 } })),
};
// const v = c(mockFs).load().get('domain');
console.log('init', c(mockFs).load().get('domain'));
