import React, { Fragment, useState, useContext } from 'react';
import RaceKey from './RaceKey';
import RaceLane from './RaceLane';
import { Button } from 'react-materialize';
import ResultContext from '../context/result/resultContext';
import Utility from '../Utility';
import moment from 'moment';

let debugging = true;

const RaceTrack = (props) => {
  const resultContext = useContext(ResultContext);
  const { setResults, clearResults } = resultContext;

  const [racers, setRacers] = useState(props.racers.map((racer) => {
    // racer.percentage = 0.25;
    return racer;
  }));
  const [sqSize] = useState(props.sqSize);
  const [inProgress, setInProgress] = useState(false);

  const startRace = () => {
    clearResults();
    let startTime = moment();
    let updates = racers.map(racer => {
      racer.startTime = startTime;
      racer.injured = false;
      racer.percentage = 0.25;
      moveRacer(racer);
      return racer;
    });
    setRacers(updates);
    setInProgress(true);
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

  const raceAgain = () => {
    startRace();
  }

  const { colors } = props;
  const stroke = 5;
  const sizer = 30;
  const increment = racers.length * sizer;
  const rSize = sqSize + increment;
  const cSize = (rSize / 2);
  const viewBox = `0 0 ${rSize} ${rSize}`;
  const radius = (rSize - stroke) / 2;
  const transformRotate = `rotate(-270 ${cSize} ${cSize})`;
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

  return (
    <Fragment>
      <svg
        height={rSize * 1.25}
        width={rSize}
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
          ry={radius}
          rx={radius * 1.25}
          style={groundStyle}
          strokeWidth={strokeWidth}
          transform={transformRotate} />

        <ellipse
          className="railing"
          cx={cSize}
          cy={cSize}
          ry={radius}
          rx={radius * 1.25}
          style={railStyle}
          strokeWidth={2}
          transform={transformRotate} />

        <ellipse
          className="railing"
          cx={cSize}
          cy={cSize}
          ry={insideRail}
          rx={insideRail * 1.25}
          style={insideRailStyle}
          strokeWidth={2}
          transform={transformRotate} />

        { racers.map( (racer, i) => (
          <RaceLane
            key={racer.id}
            strokeWidth={stroke}
            sqSize={cSize}
            laneIndex={i}
            sizer={sizer / 1.5}
            zIndex={racers.length - (i + 1)}
            percentage={racer.percentage}
            racerColor={racer.colors.primary}
            groundColor={colors.ground} />
        ))}
      </svg>

      {inProgress ? null : (
        <Button 
          className="race-again grey darken-3"
          waves="light"
          flat="true"
          onClick={raceAgain}>Race</Button>
      )}

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