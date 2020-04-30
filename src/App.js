import React, { Fragment } from 'react';
import './App.css';
import RaceTrack from './components/RaceTrack';
import racers from './racers.json'

class App extends React.Component {
  constructor(props) {
    super(props);

    racers.forEach(racer => {
      racer.percentage = 0;
      racer.finished = false;
      racer.startTime = null;
      racer.endTime = null;
    });

    this.state = {
      racers: racers
    };
  }

  render() {
    return (
      <Fragment>
        <RaceTrack racers={this.state.racers}/>
      </Fragment>
    );
  }
}

export default App;
