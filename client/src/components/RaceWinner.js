import React, { Fragment, useState, useEffect } from 'react';
// import Track from '../components/Track';
import ResultsBoard from '../components/ResultsBoard';
import moment from 'moment';

const Race = ({ racers }) => {
  const [winner, setWinner] = useState(null);

  // on mount
  useEffect(() => {
    if(racers){
      const champ = racers.find(racer => {
        return racer.RacerRace.place === 1;
      })

      if(champ){
        setWinner(champ);
      }
    }
    // eslint-disable-next-line
  }, []);

  if(!winner){
    return null;
  }

  return (
    <Fragment>
      <div 
        className="fas fa-horse fa-flip-horizontal racer-default-img"
        style={{
          backgroundColor: winner === null ? 'white' : winner.primaryColor,
          color: winner === null ? 'white' : winner.secondaryColor
        }}
        ></div>
      <h3 className="white-text text-center">Winner {winner.name}!</h3>
    </Fragment>
  );
}

export default Race;