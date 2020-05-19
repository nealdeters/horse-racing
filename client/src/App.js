import React, { Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './components/Navigation';
import LiveRace from './components/LiveRace';
import Standings from './components/Standings';
import Schedule from './components/Schedule';
import Results from './components/Results';
import Race from './components/Race';
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
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;