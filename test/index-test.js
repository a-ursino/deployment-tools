import test from 'blue-tape';
import fu from '../../src/libs/files-utils';

test('file utils getNewVersion', assert => {
	assert.throws(fu.getNewVersion, /Use a valid version type between patch, minor, major/, 'missing index');
	assert.deepEqual(fu.getNewVersion('patch', '0.0.0'), '0.0.1', 'should be a patch increment');
	assert.deepEqual(fu.getNewVersion('minor', '0.0.0'), '0.1.0', 'should be a minor increment');
	assert.deepEqual(fu.getNewVersion('major', '0.0.0'), '1.0.0', 'should be a major increment');
	assert.end();
});

test('file utils getNewVersion', assert => {
	assert.throws(fu.getNewVersion, /Use a valid version type between patch, minor, major/, 'missing index');
	assert.end();
});
