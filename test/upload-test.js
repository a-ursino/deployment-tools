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
