import React, { useEffect } from 'react'
import Utility from '../Utility';

const NotFound = props => {
	
	// on mount
	useEffect(() => {
    Utility.setBackgroundColor();

    // eslint-disable-next-line
	}, []);

	return (
		<div className="container">
			<h1 className="header white-text">Not Found</h1>
			<p className="text-center white-text lead">
				The page you are looking for does not exist.
			</p>
		</div>
	)
}

export default NotFound