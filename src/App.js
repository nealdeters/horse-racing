import React from 'react';
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
    this.shuffle(racers);
    this.state = {
      racers: racers
    };
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  render() {
    return (
      <div className="flex-container">
        <div className="track-block">
          <RaceTrack racers={this.state.racers}/>
        </div>
        <div className="results-block">
          results go here
        </div>
      </div>
    );
  }
}

export default App;
