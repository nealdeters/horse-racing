import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import Utility from '../services/Utility';
const io = Utility.io();

const RaceCountdown = ({ alwaysShow }) => {
	const [countdown, setCountdown] = useState('');
	const isMountedRef = useRef(null);

	// on mount
	useEffect(() => {
	  isMountedRef.current = true;
	  io.on("liveRace", data => {
	    if(isMountedRef.current){
	    	getCountdown(data.message);
	    }
	  });

	  // on dismount
	  return () => {
	    io.off('liveRace');
	    isMountedRef.current = false;
	  };

	  // eslint-disable-next-line
	}, []);

	const getCountdown = (data) => {
    if(alwaysShow){
    	if(data){
    		if(data === 'No Races Scheduled for Today.'){
    			setCountdown(data);
    		} else {
    			setCountdown(`Watch Live ${data}`);
    		}
    	} else {
    		setCountdown(null);
    	}
    } else {
    	if(data){
	    	if(data === 'No Races Scheduled for Today.'){
	    		setCountdown(data);
	    	} else if(data && data.includes('in')){
	    		setCountdown(`Next Race ${data}`);
		    } else {
		    	setCountdown(data);
		    }
    	} else {
	    	setCountdown(null);
	    }
    }
	}

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