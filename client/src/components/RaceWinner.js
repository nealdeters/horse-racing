import React, { Fragment, useState, useEffect } from 'react';
import RacerIcon from '../components/RacerIcon';

const RaceWinner = ({ racers }) => {
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
      <RacerIcon racer={winner} />
      <h3 className="white-text text-center">Winner {winner.name}!</h3>
    </Fragment>
  );
}

export default RaceWinner;