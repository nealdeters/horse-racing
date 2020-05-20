import React from 'react';

const RacerIcon = ({ racer }) => {

  if(!racer){
    return null;
  }

  return (
    <div 
      className="fas fa-horse fa-flip-horizontal racer-default-img"
      style={{
        backgroundColor: racer.primaryColor,
        color: racer.secondaryColor
      }}
      ></div>
  );
}

export default RacerIcon;