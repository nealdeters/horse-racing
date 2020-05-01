import React, { Fragment, useEffect, useState } from 'react';
import RaceTrack from './components/RaceTrack';
import Results from './components/Results';
import ResultState from './context/result/ResultState';
import Utility from './Utility';
import racersJson from './racers.json';
import tracksJson from './tracks.json'

import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import './App.css';

const App = () => {
  const [racers] = useState(Utility.shuffle(racersJson.map(racer => {
    racer.percentage = 0;
    racer.finished = false;
    racer.startTime = null;
    racer.endTime = null;
    return racer;
  })));
  const [track] = useState(Utility.shuffle(tracksJson)[0]);

  useEffect(() => {
    document.body.style = `background-color: ${track.colors.track};`;

    // initialize materialize js
    M.AutoInit();
  })
  
  return (
    <Fragment>
      <ResultState>
        <div
          style={{
            backgroundColor: track.colors.track,
            minHeight: `100%`
          }}>
          <Results 
            track={track} />
          <h1 className="header white-text margin-0">Derby</h1>
          <h3 className="header white-text track-name">{track.name}</h3>
          <RaceTrack 
            racers={racers}
            colors={track.colors} 
            distance={track.distance} />
        </div>
      </ResultState>
    </Fragment>
  );
}

export default App;
