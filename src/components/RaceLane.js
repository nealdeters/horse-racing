import React from 'react';

class RaceLane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sizer = 30;
    const incrementSize = this.props.laneIndex * sizer;
    const incrementPosition = this.props.zIndex * ( sizer / 2);
    const sqSize = this.props.sqSize + incrementSize;

    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    const racerStyle = {
      stroke: this.props.racerColor,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: dashArray,
      strokeDashoffset: dashOffset
    }

    if(this.props.groundColor){
      racerStyle.fill = this.props.groundColor;
    }

    const cSize = sqSize / 2;
    const transformRotate = `rotate(-270 ${sqSize / 2} ${sqSize / 2})`;
    const strokeWidth = `${this.props.strokeWidth}px`;
    const laneIndex = this.props.laneIndex;
    const stylePosition = {
      position: 'absolute',
      top: incrementPosition,
      left: incrementPosition,
      zIndex: this.props.zIndex
    }

    return (
      <svg
          width={sqSize}
          height={sqSize}
          viewBox={viewBox}
          className="race-lane"
          style={stylePosition}>
          <circle
            className="race-lane-background"
            cx={cSize}
            cy={cSize}
            r={radius}
            strokeWidth={strokeWidth}
            transform={transformRotate} />
          <circle
            className="race-lane-progress"
            cx={cSize}
            cy={cSize}
            r={radius}
            strokeWidth={strokeWidth}
            // Start progress marker at 12 O'Clock
            transform={transformRotate}
            style={racerStyle} />
      </svg>
    );
  }
}

RaceLane.defaultProps = {
  sqSize: 200,
  percentage: 25,
  strokeWidth: 10,
  color: 'red'
};

export default RaceLane;