import React, { Fragment } from 'react';
import RaceLane from './RaceLane';
import moment from 'moment';

class RaceTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      racers: props.racers
    };
  }

  componentDidMount(){
    this.state.racers.forEach(racer => {
      racer.startTime = moment();
      this.updateRacer(racer);
      this.moveRacer(racer);
    });
  }

  updateRacer(racer) {
    this.setState({racers: this.state.racers.map(r => {
      return r.id === racer.id ? racer : r;
    })});
  }

  moveRacer(racer) {
    let increment = Math.floor(Math.random() * Math.floor(10));
    racer.percentage += increment;

    this.updateRacer(racer);

    if(racer.percentage >= 100){
      racer.percentage = 100;
      racer.finished = true;
      racer.endTime = moment();

      let diff = racer.endTime.diff(racer.startTime);

      racer.duration = moment.utc(diff).format("mm:ss.SSS");
      this.updateRacer(racer);
      console.log(racer)
    } else {
      setTimeout(() => {
        this.moveRacer(racer);
      }, 2000);
    }
  }

  // race track will have a groundColor and track color
  // track color will be passed to race lane 
  // create race lanes for each racer. increase the sizing of each lane for the racers
  // the number of racers will determine the overall race track size
  // race track will determine the position of the race lanes on the element

  render() {
    const { sqSize, groundColor, trackColor } = this.props;
    const racers = this.state.racers;
    const stroke = 10;
    const sizer = 30;
    const increment = racers.length * sizer;
    const rSize = sqSize + increment;
    const cSize = (rSize / 2);

    const viewBox = `0 0 ${rSize} ${rSize}`;
    const radius = (rSize - stroke) / 2;
    const transformRotate = `rotate(-270 ${cSize} ${cSize})`;
    const strokeWidth = `${stroke}px`;
    const groundStyle = {
      fill: groundColor
    }
    const trackStyle = {
      fill: trackColor
    }

    const laneStyle = {
      width: `${cSize + increment}px`,
      height:`${cSize + increment}px`,
      left: `${ (rSize - cSize - sizer) / 2}px`
    }

    return (
      <Fragment>
        <svg
          width={rSize}
          height={rSize}
          viewBox={viewBox}
          className="race-track">
          <rect
            className="track"
            width={rSize}
            height={rSize}
            style={trackStyle} />

          <circle
            className="ground"
            cx={cSize}
            cy={cSize}
            r={radius}
            style={groundStyle}
            strokeWidth={strokeWidth}
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
      </Fragment>
    );
  }
}

RaceTrack.defaultProps = {
  sqSize: 400,
  groundColor: 'SandyBrown',
  trackColor: 'SeaGreen',
  racers: []
};

export default RaceTrack;