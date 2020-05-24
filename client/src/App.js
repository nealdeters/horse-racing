import React, { Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LiveRace from './components/LiveRace';
import Standings from './components/Standings';
import Schedule from './components/Schedule';
import TrackData from './components/TrackData';
import Results from './components/Results';
import Racer from './components/Racer';
import Race from './components/Race';
import NotFound from './components/NotFound'
import RaceState from './context/race/RaceState';
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import Utility from './services/Utility';
import './App.scss';

const App = () => {
  useEffect(() => {
    // initialize materialize js
    M.AutoInit();
    Utility.setBackgroundColor();
  }, []);
  
  return (
    <Fragment>
      <Router>
        <Navigation />
        <main>
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
        </main>
        <Footer />
      </Router>
    </Fragment>
  );
}

export default App;