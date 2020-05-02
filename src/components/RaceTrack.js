import React, { Fragment, useEffect, useRef, useState, useContext } from 'react';
import RaceKey from './RaceKey';
import { Button } from 'react-materialize';
import RaceContext from '../context/race/raceContext';
import Utility from '../Utility';
import moment from 'moment';
import M from "materialize-css/dist/js/materialize.min.js";

let debugging = false;

const RaceTrack = (props) => {
  const raceContext = useContext(RaceContext);
  const { racers, track, setRacers, setResults } = raceContext;

  const [sqSize] = useState(props.sqSize);
  const [inProgress, setInProgress] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const canvasRef = React.useRef(null);

  // canvas data
  let ctx = null;
  const stroke = 3;
  const sizer = 20;
  const increment = racers.length * sizer;
  const rSize = sqSize + increment;
  const radius = (rSize - stroke) / 2;
  const rY = 1.5;
  const cX = (rSize * rY) / 2;
  const cY = rSize / 2;
  const rotation = Math.PI / 2;
  const startAngle = 0;
  const endAngle = Math.PI * 4;

  useEffect(() => {
    drawTrack();
    racersToBlocks();

    return () => {
      
    };
    // eslint-disable-next-line
  }, [])

  const drawTrack = () => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    // clear the canvas
    ctx.clearRect(0, 0, rSize * rY, rSize);
    drawGround(ctx, rotation, startAngle, endAngle);
    drawInfield(ctx, rotation, startAngle, endAngle);
  }

  const racersToBlocks = () => {
    racers.forEach(racer => {
      drawRacer(ctx, racer);
    });
  }

  const drawGround = (ctx, rotation, startAngle, endAngle) => {
    // Draw the ground
    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      radius, radius * rY, 
      rotation, startAngle, endAngle,
      true);
 
    ctx.restore();
    ctx.fillStyle = track.colors.ground;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = track.colors.rail;
    ctx.stroke();
  }

  const drawInfield = (ctx, rotation, startAngle, endAngle) => {
    const insideRail = (radius - sizer) / 2;

    // Draw the ground
    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      insideRail, insideRail * rY, 
      rotation, startAngle, endAngle,
      true);
    
    ctx.restore();
    ctx.fillStyle = track.colors.track;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = track.colors.rails;
    ctx.stroke();
  };

  const drawRacer = (ctx, racer) => {
    if(ctx === null){
      const canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
    }

    const num = 2;
    const incrementSize = (racer.lane) * (sizer / 2.5);
    const r = ( (radius - stroke - sizer) / num) + incrementSize ;
    let startAngle = (Math.PI/180) * 360;
    let endAngle = startAngle - startAngle * racer.percentage / 100;
    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      r, r * rY,
      rotation, startAngle, endAngle,
      true);

    ctx.restore();
    ctx.lineCap = "round";
    ctx.lineWidth = stroke;
    ctx.strokeStyle = racer.colors.primary;
    ctx.stroke();
  }

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
      divisable = track.distance;

      const upperBound = Math.floor(track.distance * 0.90);
      const lowerBound = Math.floor(track.distance * 0.70);

      if(racer.type === 'starter' && racer.percentage < 33){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'middle' && (racer.percentage >= 33 && racer.percentage <= 66)){
        divisable = Utility.randomInt(lowerBound, upperBound);
      } else if(racer.type === 'finisher' && racer.percentage > 66){
        divisable = Utility.randomInt(lowerBound, upperBound);
      }
    }

    const injuryChance = 2000;
    const injuryChance1 = Utility.randomInt(1, injuryChance);
    const injuryChance2 = Utility.randomInt(1, injuryChance);
    if(injuryChance1 === injuryChance2){
      racer.injured = true;
      M.toast({html: `${racer.name} had an injury!`});
    }

    racer.percentage += (increment / divisable);
    drawRacer(ctx, racer);
    let endTime = moment();
    updateRacer(racer);

    if(racer.percentage >= 100 || racer.injured){
      if(racer.injured){
        racer.endTime = null;
      } else {
        racer.percentage = 100;
        racer.endTime = endTime;
      }

      racer.finished = true;
      updateRacer(racer);
      
      if(raceIsFinished(racers)){
        setResults(racers);
        drawTrack();
        setRacers();
        racersToBlocks();
        setInProgress(false);
      }
    } else {
      setTimeout(() => {
        moveRacer(racer);
      }, 100);
    }
  }

  return (
    <Fragment>
      <canvas
        className="race-track"
        ref={canvasRef}
        width={rSize * rY}
        height={rSize}>
      </canvas>

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