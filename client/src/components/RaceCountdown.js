import React, { Fragment, useEffect, useState } from 'react';
import Utility from '../Utility';
const io = Utility.io();

const RaceCountdown = () => {
	const [countdown, setCountdown] = useState('');

	// on mount
	useEffect(() => {
	  io.on("nextRaceCountdown", data => {
	    setCountdown(data);
	  });
	}, []);

	if(!countdown){
		return null;
	}

	return (
		<Fragment>
		  <h3 id="timer" className="timer">{countdown}</h3>
		</Fragment>
	);
}

export default RaceCountdown;