import React, { Fragment, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Utility from '../Utility';
const io = Utility.io();

const RaceCountdown = ({ alwaysShow }) => {
	const [countdown, setCountdown] = useState('');

	// on mount
	useEffect(() => {
	  io.on("nextRaceCountdown", data => {
	    if(alwaysShow){
	    	if(data){
	    		if(data === 'No Races Scheduled for Today.'){
	    			setCountdown(`${data}`);
	    		} else {
	    			setCountdown(`Watch Live ${data}`);
	    		}
	    	} else {
	    		setCountdown(null);
	    	}
	    } else {
	    	if(data === 'No Races Scheduled for Today.'){
	    		setCountdown(`${data}`);
	    	} else if(data && data.includes('in')){
	    		setCountdown(`Next Race ${data}`);
		    } else {
		    	setCountdown(null);
		    }
	    }
	  });

	  // eslint-disable-next-line
	}, []);

	return (
		<Fragment>
		  { alwaysShow ? (
		  	<div className="chip timer">
		  	  { countdown ? (
		  	  	<Link to="/">{countdown}</Link>
		  	  ) : (
		  	  	<Link to="/">Watch Live Race</Link>
		  	  )}
		  	</div>
		  ) : (
		  	countdown ? (
			  	<div className="chip timer">
			  	  <Link to="/">{countdown}</Link>
			  	</div>
		  	) : (
	  	  	null
	  	  )
		  )}
		</Fragment>
	);
}

export default RaceCountdown;