import React, { useContext, useEffect } from 'react';
import RaceTrack from '../components/RaceTrack';
import Results from '../components/Results';
import RaceContext from '../context/race/raceContext';

const Race = () => {
	const raceContext = useContext(RaceContext);
	const { racers, tracks, track, trackRacers, getRacers, getTracks, setTrack, setTrackRacers } = raceContext;

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