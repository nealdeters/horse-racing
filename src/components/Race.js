import React, { useContext, useEffect } from 'react';
import RaceTrack from '../components/RaceTrack';
import Results from '../components/Results';
import RaceContext from '../context/race/raceContext';

const Race = () => {
	const raceContext = useContext(RaceContext);
	const { racers, track, setTrack, setRacers } = raceContext;

	useEffect(() => {
	  if(racers === null){
	  	setRacers();
			setTrack();
	  }

	  if(track){
	  	document.body.style = `background-color: ${track.colors.track};`;
	  }
	  
	  // eslint-disable-next-line
	}, [track])

	if(track === null || racers === null){
		return null;
	}

	return (
		<div
		  style={{
		    backgroundColor: track.colors.track,
		    minHeight: `100%`
		  }}>
		  <Results 
		    track={track} />
		  <h1 className="header white-text margin-0">Derby</h1>
		  <h3 className="header white-text track-name">{track.name}</h3>
		  <RaceTrack />
		</div>
	);
}

export default Race;