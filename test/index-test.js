import test from 'blue-tape';
import getNewVersion from '../src/libs/version';

test('getNewVersion', assert => {
	assert.throws(getNewVersion, /Use a valid version type between patch, minor, major/, 'missing index');
	assert.deepEqual(getNewVersion('patch', '0.0.0'), '0.0.1', 'should be a patch increment');
	assert.deepEqual(getNewVersion('minor', '0.0.0'), '0.1.0', 'should be a minor increment');
	assert.deepEqual(getNewVersion('major', '0.0.0'), '1.0.0', 'should be a major increment');
	assert.end();
});
