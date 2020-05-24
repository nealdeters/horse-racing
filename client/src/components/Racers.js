import React, { useEffect } from 'react'
import Utility from '../services/Utility';

const Racers = props => {
	
	// on mount
	useEffect(() => {
    Utility.setBackgroundColor();

    // eslint-disable-next-line
	}, []);

	return (
		<div className="container">
			<h1 className="header white-text">Racers</h1>
			<p className="lead white-text">
				Racers list coming soon.
			</p>
		</div>
	)
}

export default Racers