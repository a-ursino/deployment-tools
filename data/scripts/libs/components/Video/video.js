import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies

const Video = ({ editionTitle, domain }) => (
	<div className="list-wrap-item">
		<div>editionTitle: {editionTitle}</div>
		<div>domain: {domain}</div>
	</div>
);

Video.propTypes = {
	editionTitle: React.PropTypes.string,
	domain: React.PropTypes.string,
};

export default Video;
