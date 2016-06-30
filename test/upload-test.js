import test from 'blue-tape';
import { stub } from 'sinon';
import { prepareImagesFilesAsync, prepareJsFilesAsync, prepareCssFilesAsync } from '../src/upload';

/** @test {config} */
// Manage CSS files
test('Manage CSS files for upload: prepareCssFilesAsync', async assert => {
	// assert.plan(4);
	assert.equal(typeof prepareCssFilesAsync, 'function', 'prepareCssFilesAsync should be a function');
	assert.deepEqual(await prepareCssFilesAsync({}), [], 'should be an empty array');

	assert.deepEqual(await prepareCssFilesAsync({ dir: stub().returns([]), longTermHash: false }), [], 'an empty directory should return an empty array');

	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['main.css']), longTermHash: false, buildPathCss: '/data/css/' }),
		[{ file: 'main.css', remoteDest: '/main.css'}]
	);
	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['main.css', 'main-backoffice.css']), longTermHash: false, buildPathCss: '/data/css/', version: '1.0.0' }),
		[{ file: 'main.css', remoteDest: '1.0.0/main.css'}, { file: 'main-backoffice.css', remoteDest: '1.0.0/main-backoffice.css'}],
		'should be an array of object'
	);
	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['main.css', 'main-backoffice.css']), longTermHash: false, buildPathCss: '/data/css/', version: '1.0.0' }),
		[{ file: 'main.css', remoteDest: '1.0.0/main.css'}, { file: 'main-backoffice.css', remoteDest: '1.0.0/main-backoffice.css'}],
		'should be an array of object'
	);
	// LONG TERM HASH
	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['main.css']), longTermHash: true, buildPathCss: '/data/css/' }),
		[],
		'if we use longterm hash but the input doesn\'t contains any hashed file, should return an empty array'
	);
	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['7312hwhw.css']), longTermHash: true, buildPathCss: '/data/css/' }),
		[],
		'the hash should be a valid md5 hash'
	);
	assert.deepEqual(
		await prepareCssFilesAsync({ dir: stub().returns(['38ef2f0c714372f9e033dad37e0cda84.css', 'main.css']), longTermHash: true, buildPathCss: '/data/css/' }),
		[],
		'main.css should be take out'
	);
});

// Manage JavaScript files
test('Manage JavaScript files for upload: prepareJsFilesAsync', async assert => {
	assert.equal(typeof prepareJsFilesAsync, 'function', 'prepareJsFilesAsync should be a function');
	assert.deepEqual(await prepareJsFilesAsync({}), [], 'should be an empty array');
	assert.deepEqual(await prepareJsFilesAsync({ dir: stub().returns([]), longTermHash: false }), [], 'an empty directory should return an empty array');

	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['main.js']), longTermHash: false, buildPathJs: '/data/Scripts/' }),
		[{ file: 'main.js', remoteDest: '/main.js'}]
	);
	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['main.js', 'vendors.js']), longTermHash: false, buildPathJs: '/data/Scripts/', version: '1.0.0' }),
		[{ file: 'main.js', remoteDest: '1.0.0/main.js'}, { file: 'vendors.js', remoteDest: '1.0.0/vendors.js'}],
		'should be an array of object'
	);
	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['main.js', 'vendors.js', 'main-backoffice.js', 'vendors-backoffice.js']), longTermHash: false, buildPathJs: '/data/Scripts/', version: '1.0.0' }),
		[{ file: 'main.js', remoteDest: '1.0.0/main.js'}, { file: 'vendors.js', remoteDest: '1.0.0/vendors.js'}, { file: 'main-backoffice.js', remoteDest: '1.0.0/main-backoffice.js'}, { file: 'vendors-backoffice.js', remoteDest: '1.0.0/vendors-backoffice.js'}],
		'should be an array of object'
	);
	// LONG TERM HASH
	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['main.js']), longTermHash: true, buildPathCss: '/data/Scripts/' }),
		[],
		'if we use longterm hash but the input doesn\'t contains any hashed file, should return an empty array'
	);
	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['7312hwhw.js', '25d307f8089adf9f4633.js']), longTermHash: true, buildPathJs: '/data/Scripts/' }),
		[],
		'the hash should be a valid webpack hash hash'
	);
	assert.deepEqual(
		await prepareJsFilesAsync({ dir: stub().returns(['0.25d307f8089adf9f4633.js', 'main.0054321a4b9b5e829c03.js']), longTermHash: true, buildPathJs: '/data/Scripts/' }),
		[{ file: '0.25d307f8089adf9f4633.js', remoteDest: '0.25d307f8089adf9f4633.js'}, { file: 'main.0054321a4b9b5e829c03.js', remoteDest: 'main.0054321a4b9b5e829c03.js'}],
		'should be an array of objects'
	);
});

// Manage images files
test('Manage images files for upload: prepareImagesFilesAsync', async assert => {
	assert.equal(typeof prepareImagesFilesAsync, 'function', 'prepareImagesFilesAsync should be a function');
	assert.deepEqual(await prepareImagesFilesAsync({}), [], 'should be an empty array');
	assert.deepEqual(await prepareImagesFilesAsync({ dir: stub().returns([])}), [], 'an empty directory should return an empty array');
	assert.deepEqual(
		await prepareImagesFilesAsync({ dir: stub().returns(['bg.png']), imagesPath: '/data/images/'}),
		[{ file: 'bg.png', remoteDest: 'data/images/bg.png'}],
		'should be an array of objects');
});
