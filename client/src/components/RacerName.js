import React from 'react';
import { Link } from "react-router-dom";

const RacerName = ({ racer, strikeName }) => {
  return (
    <div className="racer-name">
      <span className="left">
        <div 
          className="color"
          style={{
            backgroundColor: racer.primaryColor,
            display: 'inline-block',
            marginRight: '10%',
            float: 'left'
          }}>
        </div>
      </span>
      <Link 
        className={strikeName && racer.RacerRace.injured  ? 
          'name strike-name' : 'name'}
        to={`/racers/${racer.id}`}>
        {racer.name}
      </Link>
      <span className="right"></span>
    </div>
  );
}

export default RacerName;