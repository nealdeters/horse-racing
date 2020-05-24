import React, { useContext, useEffect, useRef } from 'react';
import RaceTrack from '../components/RaceTrack';
import RaceCountdown from '../components/RaceCountdown';
import RaceContext from '../context/race/raceContext';
import Utility from '../services/Utility';
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
      	if(data.race){
      		setRace(data.race);
      		Utility.setBackgroundColor(data.race.Track.trackColor);
      	}
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
	// useEffect(() => {
	// 	if(track){
	// 		Utility.setBackgroundColor(track.trackColor);
	// 	}
	// }, [track])

	return (
		<div className="live-race">
		  <h1 className="header white-text">{track.name}</h1>
		  <RaceCountdown alwaysShow={false}/>
		  <RaceTrack />
		</div>
	);
}

export default LiveRace;