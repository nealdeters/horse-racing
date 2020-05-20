import React, { useEffect } from 'react'
import Utility from '../Utility';

const Tracks = props => {
	
	// on mount
	useEffect(() => {
    Utility.setBackgroundColor();

    // eslint-disable-next-line
	}, []);

	return (
		<div className="container">
			<h1 className="header white-text">Tracks</h1>
			<p className="lead">
				Tracks list coming soon.
			</p>
		</div>
	)
}

export default Tracks