import test from 'blue-tape';
import { stub } from 'sinon';
import c from '../../src/libs/config';

test('config', assert => {
	// mock is an object that contains a method readFileSync thats return an json string
	const mockFs = {
		readFileSync: stub().returns(JSON.stringify({ config: { version: 2 } })),
	};
	const config = c(mockFs).load();
	assert.equal(config.store, undefined, 'should be private');
	assert.deepEqual(config.get('version'), 2, 'should configured');
	assert.end();
});
