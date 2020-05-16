import React, { Fragment, useEffect } from 'react';
import Race from './components/Race';
import Results from './components/Results';
import RaceState from './context/race/RaceState';
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import './App.scss';

const App = () => {
  useEffect(() => {
    // initialize materialize js
    M.AutoInit();
  })
  
  return (
    <Fragment>
      <RaceState>
        <Results />
        <Race />
      </RaceState>
    </Fragment>
  );
}

export default App;