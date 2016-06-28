import test from 'blue-tape';
import { getDateString, format } from '../../src/libs/time';

/** @test {time} */
test('time utility', assert => {
	assert.equal(typeof format, 'function', 'format should be a function');
	assert.equal(typeof getDateString, 'function', 'getDateString should be a function');
	assert.equal(format(new Date(2016, 5, 19, 10, 0, 0)), '10:00:00', 'should be equal to 10:00:00');
	assert.end();
});
