import React, { Fragment } from 'react';

class RaceLane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sizer = this.props.sizer;
    const incrementSize = this.props.laneIndex * sizer;
    const sqSize = this.props.sqSize + incrementSize;

    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (sqSize - this.props.strokeWidth) / 2;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    const racerStyle = {
      stroke: this.props.racerColor,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: dashArray,
      strokeDashoffset: dashOffset,
      display: 'block',
      margin: 'auto'
    }

    const cSize = sqSize;
    const transformRotate = `rotate(-270 ${sqSize / 2} ${sqSize / 2})`;
    const strokeWidth = `${this.props.strokeWidth}px`;

    return (
      <Fragment>
        <circle
          className="race-lane-progress"
          cx="50%"
          cy={incrementSize}
          r={radius}
          strokeWidth={strokeWidth}
          transform={transformRotate}
          style={racerStyle} />
      </Fragment>
    );
  }
}

RaceLane.defaultProps = {
  sqSize: 200,
  percentage: 25,
  strokeWidth: 10,
  color: 'red',
  sizer: 30
};

export default RaceLane;