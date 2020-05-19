import React, { useContext, useEffect } from 'react';
import RaceTrack from '../components/RaceTrack';
import RaceContext from '../context/race/raceContext';
import Utility from '../Utility';
const io = Utility.io();

const LiveRace = () => {
	const raceContext = useContext(RaceContext);
	const { track, setRace } = raceContext;

	// on mount
	useEffect(() => {
    io.on("raceResults", data => {
      setRace(data);
    });

    // eslint-disable-next-line
	}, []);

	// on update
	useEffect(() => {
	  if(track){
	  	document.body.style = `background-color: ${track.trackColor};`;
	  }

	  // eslint-disable-next-line
	}, [track])

	return (
		<div
		  style={{
		    backgroundColor: track.trackColor,
		    minHeight: `100%`
		  }}>
		  <h1 className="header white-text track-name">{track.name}</h1>
		  <RaceTrack />
		</div>
	);
}

export default LiveRace;