import React, { useContext, useEffect } from 'react';
import RaceTrack from '../components/RaceTrack';
import Results from '../components/Results';
import RaceContext from '../context/race/raceContext';
import socketIOClient from "socket.io-client";

let io = socketIOClient(process.env.SOCKET_URL);

const Race = () => {
	const raceContext = useContext(RaceContext);
	const { racers, tracks, track, trackRacers, getRacers, getTracks, setTrack, setTrackRacers } = raceContext;

	// on mount
	useEffect(() => {
    io.on("raceResults", data => {
      console.log(data)
      // setSocket(data.racers);
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
		  <h1 className="header white-text margin-0 uppercase">derby</h1>
		  <h3 className="header white-text track-name">{track.name}</h3>
		  <RaceTrack />
		</div>
	);
}

export default Race;