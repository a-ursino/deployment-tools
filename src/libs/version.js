import semver from 'semver';

/**
 * Increment the string version accorging semver
 * @param  {String} newVersionType A string that contains the new version type
 * @param  {String} version        The actual version
 * @return {String}                The new version accorging to newVersionType
 */
function getNewVersion(newVersionType, version) {
	if (newVersionType !== 'patch' && newVersionType !== 'minor' && newVersionType !== 'major') {
		throw new Error('Use a valid version type between patch, minor, major');
	}
	// npm --no-git-tag-version version. this update package.json directly
	return semver.inc(version, newVersionType);
}

export default getNewVersion;
