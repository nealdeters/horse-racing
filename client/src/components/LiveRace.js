import React, { useContext, useEffect, useRef } from 'react';
import RaceTrack from '../components/RaceTrack';
import RaceCountdown from '../components/RaceCountdown';
import RaceContext from '../context/race/raceContext';
import Utility from '../Utility';
const io = Utility.io();

const LiveRace = () => {
	const raceContext = useContext(RaceContext);
	const { track, setRace } = raceContext;
	const isMountedRef = useRef(null);

	// on mount
	useEffect(() => {
    isMountedRef.current = true;
    io.on("liveRace", data => {
      if(isMountedRef.current){
      	setRace(data.race);
      }
    });

    // on dismount
    return () => {
      io.off('liveRace');
      isMountedRef.current = false;
    };

    // eslint-disable-next-line
	}, []);

	// on update
	useEffect(() => {
	  if(track){
	  	Utility.setBackgroundColor(track.trackColor);
	  }

	  // eslint-disable-next-line
	}, [track])

	return (
		<div
		  style={{
		    backgroundColor: track.trackColor,
		    minHeight: `100%`
		  }}>
		  <h1 className="header white-text">{track.name}</h1>
		  <RaceCountdown alwaysShow={false}/>
		  <RaceTrack />
		</div>
	);
}

export default LiveRace;