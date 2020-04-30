import React, { Fragment, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RaceTrack from './components/RaceTrack';
import Results from './components/Results';
import ResultState from './context/result/ResultState';
import Utility from './Utility';
import racersJson from './racers.json';
import tracksJson from './tracks.json'

const App = () => {
  const [racers] = useState(Utility.shuffle(racersJson.map(racer => {
    racer.percentage = 0;
    racer.finished = false;
    racer.startTime = null;
    racer.endTime = null;
    return racer;
  })));
  let e
  const [track, setTrack] = useState(Utility.shuffle(tracksJson)[0]);
  const [tracks, setTracks] = useState(tracksJson);
  
  return (
    <Fragment>
      <ResultState>
        <div
          style={{
            backgroundColor: track.trackColor,
            height: '100vh'
          }}>
          <Results 
            track={track} />
          <h1 className="header white-text">Cat Cave Derby</h1>
          <RaceTrack 
            racers={racers}
            trackColor={track.trackColor} 
            groundColor={track.groundColor} 
            railColor={track.railColor} />
        </div>
      </ResultState>
    </Fragment>
  );
}

export default App;
