import React, { Fragment, useState, useContext } from 'react';
import RaceKey from './RaceKey';
import RaceLane from './RaceLane';
import { Button } from 'react-materialize';
import RaceContext from '../context/race/raceContext';
import Utility from '../Utility';
import moment from 'moment';

let debugging = false;

const RaceTrack = (props) => {
  const raceContext = useContext(RaceContext);
  const { setResults } = raceContext;

  const [racers, setRacers] = useState(props.racers.map((racer) => {
    return racer;
  }));
  const [sqSize] = useState(props.sqSize);
  const [inProgress, setInProgress] = useState(false);
  const [countdown, setCountdown] = useState(false);

  const startRace = () => {
    setCountdown(true);
    startTimer(5, document.querySelector('#timer'));
  }

  const startTimer = (duration, display) => {
    let start = Date.now(),
      diff,
      minutes,
      seconds;

    // we don't want to wait a full second before the timer starts
    timer();
    const inter = setInterval(timer, 1000);

    function timer(){
      diff = duration - (((Date.now() - start) / 1000) | 0);

      minutes = (diff / 60) | 0;
      seconds = (diff % 60) | 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds; 

      if (diff === 0) {
        display.textContent = "";

        const startTime = moment();
        const rUpdates = racers.map(racer => {
          racer.startTime = startTime;
          racer.injured = false;
          racer.percentage = 0;
          moveRacer(racer);
          return racer;
        });
        setRacers(rUpdates);
        setInProgress(true);

        clearInterval(inter);
        setCountdown(false);
      }
    };
  }

  const updateRacer = (racer) => {
    setRacers(racers.map(r => {
      return r.id === racer.id ? racer : r;
    }));
  }

  const raceIsFinished = (racers) => {
    return racers.every(racer => {
      return racer.finished;
    })
  }

  const moveRacer = (racer) => {
    const increment = Utility.randomInt(1, 10);
    let divisable = null;

    if(debugging){
      divisable = 1;
    } else {
      divisable = props.distance;

      const upperBound = Math.floor(props.distance * 0.90);
      const lowerBound = Math.floor(props.distance * 0.70);

      if(racer.type === 'starter' && racer.percentage < 33){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'middle' && (racer.percentage >= 33 && racer.percentage <= 66)){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'finisher' && racer.percentage > 66){
        divisable = Utility.randomInt(lowerBound, upperBound);
      }
    }

    const injuryChance = 10000;
    const injuryChance1 = Utility.randomInt(1, injuryChance);
    const injuryChance2 = Utility.randomInt(1, injuryChance);
    if(injuryChance1 === injuryChance2){
      racer.injured = true;
      // console.log(`${racer.name} got injured`)
    }

    racer.percentage += (increment / divisable);
    let endTime = moment();
    updateRacer(racer);

    if(racer.percentage >= 100 || racer.injured){
      if(racer.injured){
        racer.endTime = null;
        racer.percentage = 0;
      } else {
        racer.percentage = 100;
        racer.endTime = endTime;
      }
      racer.finished = true;
      updateRacer(racer);
      
      if(raceIsFinished(racers)){
        setResults(racers);
        let updates = Utility.resetRacers(racers);
        setRacers(updates);
        setInProgress(false);
      }
    } else {
      setTimeout(() => {
        moveRacer(racer);
      }, 100);
    }
  }

  const { colors } = props;
  const stroke = 4;
  const sizer = 20;
  const increment = racers.length * sizer;
  const rSize = sqSize + increment;
  const cSize = (rSize / 2);
  const viewBox = `0 0 ${rSize} ${rSize}`;
  const radius = (rSize - stroke) / 2;
  const transformRotate = `rotate(90 ${cSize} ${cSize})`;
  const strokeWidth = `${stroke}px`;
  const insideRail = (cSize - sizer) / 2;

  const groundStyle = {
    fill: colors.ground
  }

  const trackStyle = {
    fill: colors.track
  }

  const railStyle = {
    fill: colors.ground,
    stroke: colors.rail
  }

  const insideRailStyle = {
    fill: colors.track,
    stroke: colors.rail
  }

  const rY = 1.5;

  return (
    <Fragment>
      <svg
        height={rSize}
        width={rSize * rY}
        viewBox={viewBox}
        className="race-track">

        <rect
          className="track"
          width={rSize}
          height={rSize}
          style={trackStyle} />

        <ellipse
          className="ground"
          cx={cSize}
          cy={cSize}
          ry={radius * rY}
          rx={radius}
          style={groundStyle}
          strokeWidth={strokeWidth}
          transform={transformRotate} />

        <ellipse
          className="railing"
          cx={cSize}
          cy={cSize}
          ry={radius * rY}
          rx={radius}
          style={railStyle}
          strokeWidth={2}
          transform={transformRotate} />

        <ellipse
          className="railing"
          cx={cSize}
          cy={cSize}
          ry={insideRail * rY}
          rx={insideRail}
          style={insideRailStyle}
          strokeWidth={2}
          transform={transformRotate} />

        { racers.map( (racer, i) => (
          <RaceLane
            key={racer.id}
            strokeWidth={stroke}
            sqSize={cSize}
            laneIndex={i}
            sizer={sizer / rY}
            zIndex={racers.length - (i + 1)}
            percentage={racer.percentage}
            racerColor={racer.colors.primary}
            groundColor={colors.ground} />
        ))}
      </svg>

      {inProgress || countdown ? null : (
        <Button 
          waves="light"
          flat={true}
          className="race-again grey darken-3 white-text"
          onClick={startRace}>Race</Button>
      )}

      <div id="timer" className="timer"></div>

      <RaceKey racers={racers}/>
    </Fragment>
  );
}

RaceTrack.defaultProps = {
  sqSize: 75,
  colors: {
    ground: 'SandyBrown',
    track: 'SeaGreen',
    rail: 'black'
  },
  distance: 20,
  racers: []
};

export default RaceTrack;