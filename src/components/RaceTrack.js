import React, { Fragment, useState, useContext } from 'react';
import RaceKey from './RaceKey';
import RaceLane from './RaceLane';
import Button from 'react-bootstrap/Button';
import ResultContext from '../context/result/resultContext';
import Utility from '../Utility';
import moment from 'moment';

let debugging = false;

const RaceTrack = (props) => {
  const resultContext = useContext(ResultContext);
  const { setResults, clearResults } = resultContext;

  const [racers, setRacers] = useState(props.racers);
  const [sqSize] = useState(props.sqSize);
  const [inProgress, setInProgress] = useState(false);

  // useEffect(() => {
  //   if(racers){
  //     racers.forEach(racer => {
  //       racer.percentage+= 1;
  //     });
  //     console.log('set racers')
  //     setRacers(racers);
  //   }
  // }, []);

  const startRace = () => {
    clearResults();
    let startTime = moment();
    racers.forEach(racer => {
      racer.startTime = startTime;
      // racer.extraBoost = 3;
      racer.injured = false;
      updateRacer(racer);
      moveRacer(racer);
    });
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
      divisable = props.trackDistance;

      const upperBound = Math.floor(props.trackDistance * 0.90);
      const lowerBound = Math.floor(props.trackDistance * 0.70);

      if(racer.type === 'start' && racer.percentage < 33){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'middle' && (racer.percentage >= 33 && racer.percentage <= 66)){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'end' && racer.percentage > 66){
        divisable = Utility.randomInt(lowerBound, upperBound);
      }
    }

    const injuryChance = Utility.randomInt(1, 10000);
    if(injuryChance === Utility.randomInt(1, 10000)){
      racer.injured = true;
      // console.log(`${racer.name} got injured`)
    }

    racer.percentage += (increment / divisable);
    let endTime = moment();

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
        Utility.resetRacers(racers);
        setRacers(racers);
        setInProgress(false);
      }
    } else {
      updateRacer(racer);
      setTimeout(() => {
        moveRacer(racer);
      }, 100);
    }
  }

  const raceAgain = () => {
    startRace();
  }

  // race track will have a groundColor and track color
  // track color will be passed to race lane 
  // create race lanes for each racer. increase the sizing of each lane for the racers
  // the number of racers will determine the overall race track size
  // race track will determine the position of the race lanes on the element

  const { groundColor, trackColor, railColor } = props;
  const stroke = 10;
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
    fill: groundColor
  }

  const trackStyle = {
    fill: trackColor
  }

  const railStyle = {
    fill: groundColor,
    stroke: railColor
  }

  const insideRailStyle = {
    fill: trackColor,
    stroke: railColor
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
            sizer={sizer}
            zIndex={racers.length - (i + 1)}
            percentage={racer.percentage}
            racerColor={racer.color}
            groundColor={groundColor} />
        ))}
      </svg>

      {inProgress ? null : (
        <Button 
          className="race-again"
          variant="dark" 
          onClick={raceAgain}>Race</Button>
      )}

      <RaceKey racers={racers}/>
    </Fragment>
  );
}

RaceTrack.defaultProps = {
  sqSize: 200,
  groundColor: 'SandyBrown',
  trackColor: 'SeaGreen',
  railColor: 'black',
  trackDistance: 20,
  racers: []
};

export default RaceTrack;