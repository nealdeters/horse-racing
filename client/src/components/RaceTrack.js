import React, { Fragment, useContext } from 'react';
import Track from './Track';
import RaceCountdown from './RaceCountdown';
import RaceKey from './RaceKey';
import RaceContext from '../context/race/raceContext';


const RaceTrack = (props) => {
  const raceContext = useContext(RaceContext);
  const { race, racers, track } = raceContext;

  return (
    <Fragment>
      <Track 
        race={race} 
        racers={racers} 
        track={track} />
      <RaceCountdown />
      <RaceKey />
    </Fragment>
  );
}

export default RaceTrack;