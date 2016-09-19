import React from 'react'; // eslint-disable-line no-unused-vars, import/no-extraneous-dependencies
import ReactDOM from 'react-dom';// eslint-disable-line import/no-extraneous-dependencies
import Video from '../components/Video';

/**
* Configure homepage
* @return {undefined}
*/
export default function configHomepage() {
	/* eslint-disable no-undef*/
	const domHandle = document.getElementById('js-react-wrap');
	if (domHandle) {
		/* pass some dummy data as props */
		ReactDOM.render(<Video domain="http://www.google.it" editionTitle="backoffice" />, domHandle);
	}
}
