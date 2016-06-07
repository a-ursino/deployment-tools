import test from 'blue-tape';
import { stub } from 'sinon';
import c from '../src/libs/config';

test('config', assert => {
	const mockFs = {
		readFileSync: stub().returns(JSON.stringify({ version: 2, config: { } })),
	};
	const config = c({ fileSystem: mockFs, inDev: false }).load();
	assert.equal(config.store, undefined, 'should be private');
	assert.deepEqual(config.get('version'), 2, 'should configured');
	assert.end();
});
