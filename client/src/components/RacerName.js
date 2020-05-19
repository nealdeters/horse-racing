import React, { Fragment } from 'react';

const RacerName = ({ racer, strikeName }) => {
  return (
    <Fragment>
      { strikeName ? (
        <span className={racer.RacerRace.injured ? 'racer-name strike-name' : 'racer-name'}>{racer.name}</span>
      ) : (
        <span className='racer-name'>{racer.name}</span>
      )}
      <div 
        className="racer-color"
        style={{
          backgroundColor: racer.primaryColor,
          display: 'inline-block',
          marginRight: '10%',
          float: 'right'
        }}>
      </div>  
    </Fragment>
  );
}

export default RacerName;