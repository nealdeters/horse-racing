import React, { Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './components/Navigation';
import LiveRace from './components/LiveRace';
import Standings from './components/Standings';
import Schedule from './components/Schedule';
import TrackData from './components/TrackData';
import Results from './components/Results';
import Racer from './components/Racer';
import Race from './components/Race';
import Racers from './components/Racers';
import Tracks from './components/Tracks';
import NotFound from './components/NotFound'
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
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <RaceState>
              <Results />
              <LiveRace />
            </RaceState>
          </Route>
          <Route exact path="/schedule" component={Schedule} />
          <Route exact path="/standings" component={Standings} />
          <Route exact path="/races/:id" component={Race} />
          <Route exact path="/tracks/:id" component={TrackData} />
          <Route exact path="/racers/:id" component={Racer} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;