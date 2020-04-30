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
    })
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

  // <svg
  //     width={sqSize * 2}
  //     height={sqSize}
  //     viewBox={viewBox}>
  //     <rect
  //       className="track-rectangle"
  //       width={sqSize * 2}
  //       height={sqSize}
  //       style={groundStyle} />

  //     <circle
  //       className="circle-background"
  //       cx={cSize}
  //       cy={cSize}
  //       r={radius}
  //       style={trackStyle}
  //       strokeWidth={strokeWidth}
  //       transform={transformRotate} />
  // </svg>

  render() {
    const { sqSize, groundColor, trackColor } = this.props;
    const racers = this.state.racers;
    const sizer = 10;

    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const radius = (this.props.sqSize - sizer) / 2;
    const cSize = this.props.sqSize / 2;
    const transformRotate = `rotate(-270 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`;
    const strokeWidth = `${sizer}px`;
    const groundStyle = {
      stroke: groundColor
    }
    const trackStyle = {
      stroke: trackColor
    }

    return (
      <Fragment>
        { racers.map( (racer, i) => (
          <RaceLane
            key={racer.id}
            strokeWidth={sizer}
            sqSize={400}
            laneIndex={i}
            zIndex={racers.length - (i + 1)}
            percentage={racer.percentage}
            racerColor={racer.color}
            groundColor={groundColor} />
        ))}
      </Fragment>
    );
  }
}

RaceTrack.defaultProps = {
  sqSize: 600,
  groundColor: 'SandyBrown',
  trackColor: 'SeaGreen',
  racers: []
};

export default RaceTrack;