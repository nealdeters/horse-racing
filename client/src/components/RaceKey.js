import React, { useContext } from 'react';
import RaceContext from '../context/race/raceContext';
import { ProgressBar } from 'react-materialize';
import RacerName from '../components/RacerName';

const RaceKey = (props) => {
  const raceContext = useContext(RaceContext);
  const { racers } = raceContext;
  
  return (
    <div className="race-key">
      { racers.length ? (
        <table className="race-key-board white-text">
          <thead>
            <tr>
              <th className="uppercase normal">Name</th>
              <th className="uppercase normal">Lane</th>
              <th className="uppercase normal">Progress</th>
            </tr>
          </thead>
          <tbody>
            {racers && racers.map((racer, i) => (
              <tr key={racer.id}>
                <td>
                  <RacerName racer={racer} strikeName={true} />
                </td>
                <td>{racer.RacerRace.lane}</td>
                <td>
                  <div className="racer-progress" style={{backgroundColor: racer.primaryColor}}>
                    <ProgressBar progress={racer.RacerRace.percentage} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        null
      )}
  	</div>
  );
}

export default RaceKey;