import React, { useContext, useEffect, useState } from 'react';
import RaceTrack from '../components/RaceTrack';
import Results from '../components/Results';
import RaceContext from '../context/race/raceContext';
import socketIOClient from "socket.io-client";
let io = socketIOClient('http://localhost:3001/');

const Race = () => {
	const raceContext = useContext(RaceContext);
	const { racers, tracks, track, trackRacers, getRacers, getTracks, setTrack, setTrackRacers } = raceContext;
	const [socket, setSocket] = useState(0);

	// on mount
	useEffect(() => {
    io.on("raceProgress", data => {
      setSocket(data);
    });
	}, []);

	// on update
	useEffect(() => {
	  if(racers === null){
  		getRacers();
  		getTracks();
	  } else {
	  	setTrackRacers();
	  	setTrack();
	  }

	  if(track){
	  	document.body.style = `background-color: ${track.trackColor};`;
	  }
	  
	  // eslint-disable-next-line
	}, [track, tracks])

	if(track === null || trackRacers === null){
		return null;
	}

	return (
		<div
		  style={{
		    backgroundColor: track.trackColor,
		    minHeight: `100%`
		  }}>
		  <Results 
		    track={track} />
		  <div>{socket}</div>
		  <h1 className="header white-text margin-0 uppercase">derby</h1>
		  <h3 className="header white-text track-name">{track.name}</h3>
		  <RaceTrack />
		</div>
	);
}

export default Race;