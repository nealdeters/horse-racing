import React, { Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './Navigation';
import Race from './components/Race';
import Standings from './components/Standings';
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
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <RaceState>
              <Results />
              <Race />
            </RaceState>
          </Route>
          <Route exact path="/standings" component={Standings} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;