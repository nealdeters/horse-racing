import React, { Fragment, useEffect, useState, useContext } from 'react';
import RaceKey from './RaceKey';
import RaceContext from '../context/race/raceContext';
import socketIOClient from "socket.io-client";

let io = socketIOClient(process.env.SOCKET_URL);

const RaceTrack = (props) => {
  const raceContext = useContext(RaceContext);
  const { racers, track } = raceContext;

  const [size] = useState(props.size);
  const [countdown, setCountdown] = useState('');

  // canvas data
  const maxRacers = 8;
  const stroke = 5;
  const laneIncrement = 20;
  const rY = 1.5;
  const totalLaneIncrement = maxRacers * laneIncrement;
  const height = size + totalLaneIncrement;
  const width = height * rY;
  const radius = (height - stroke) / 2;
  const cX = (width) / 2;
  const cY = height / 2;
  const rotation = Math.PI / 2;
  const startAngle = 0;
  const endAngle = Math.PI * 4;
  const racerStartAngle = (Math.PI/180) * 360;
  const racerAngles = {};

  // on mount
  useEffect(() => {
    io.on("nextRaceCountdown", data => {
      setCountdown(data);
    });
  }, []);

  // on update
  useEffect(() => {
    if(track){
      drawTrack();
    }

    if(racers){
      racersToBlocks();
    }

    // eslint-disable-next-line
  }, [track, racers])

  const drawTrack = () => {
    const canvas = document.getElementById('race-track');
    const ctx = canvas.getContext('2d');

    // clear the canvas
    ctx.clearRect(0, 0, width, height);
    drawGround(ctx, rotation, startAngle, endAngle);
    drawInfield(ctx, rotation, startAngle, endAngle);
    drawFinishLine(ctx);
  }

  const racersToBlocks = () => {
    racers.forEach(racer => {
      racerAngles[racer.RacerRace.lane] = (racerStartAngle) + (.2 - ( (racer.RacerRace.lane / .8) / 100) );
      drawRacer(racer);
    });
  }

  const drawGround = (ctx, rotation, startAngle, endAngle) => {
    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      radius, radius * rY, 
      rotation, startAngle, endAngle,
      true);
 
    ctx.restore();
    ctx.fillStyle = track.groundColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = track.railColor;
    ctx.stroke();
  }

  const drawFinishLine = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(cX, cY + 49);
    ctx.lineTo(cX, height - 1);
    ctx.stroke();
  }

  const drawInfield = (ctx, rotation, startAngle, endAngle) => {
    const insideRail = (radius - laneIncrement) / 2;

    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      insideRail, insideRail * rY, 
      rotation, startAngle, endAngle,
      true);
    
    ctx.restore();
    ctx.fillStyle = track.trackColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = track.rails_color;
    ctx.stroke();
  };

  const drawRacer = (racer) => {
    const canvas = document.getElementById(`race-lane-${racer.RacerRace.lane}`);
    const ctx = canvas.getContext('2d');

    // clear the canvas
    ctx.clearRect(0, 0, width, height);

    const num = 2;
    const incrementSize = (racer.RacerRace.lane) * (laneIncrement / 2.5);
    const r = ( (radius - stroke - laneIncrement) / num) + incrementSize ;
    let startAngle = racerAngles[racer.RacerRace.lane];
    let endAngle = racerStartAngle - ( (racerStartAngle * racer.RacerRace.percentage) / 100);
    racerAngles[racer.RacerRace.lane] = (endAngle) + (.2 - ( (racer.RacerRace.lane / .8) / 100) );

    ctx.beginPath();
    ctx.ellipse(
      cX, cY, 
      r, r * rY,
      rotation, startAngle, endAngle,
      true);

    ctx.restore();
    ctx.lineCap = "round";
    ctx.lineWidth = stroke;
    ctx.strokeStyle = racer.primaryColor;
    ctx.stroke();
  }

  return (
    <Fragment>
      <div 
        className="race-track"
        style={{ 
          height: height, 
          width: (width) 
        }}>
        <canvas
          id="race-track"
          width={width}
          height={height} />

        { racers.map(racer => (
          <canvas 
            key={racer.RacerRace.lane}
            id={`race-lane-${racer.RacerRace.lane}`}
            width={width}
            height={height} />
        ))}
      </div>

      { countdown ? (
        <h3 id="timer" className="timer">{countdown}</h3>
      ) : null }

      { racers.length ? (
        <RaceKey />
      ) : (
        null
      )}
    </Fragment>
  );
}

RaceTrack.defaultProps = {
  size: 75
};

export default RaceTrack;