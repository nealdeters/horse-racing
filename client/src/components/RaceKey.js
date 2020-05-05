import React, { useContext } from 'react';
import RaceContext from '../context/race/raceContext';
import { ProgressBar } from 'react-materialize';

const RaceKey = (props) => {
  const raceContext = useContext(RaceContext);
  const { racers } = raceContext;
  
  return (
    <div className="race-key">
      <table className="white-text">
  			<thead>
  				<tr>
  					<th className="uppercase normal">Color</th>
            <th className="uppercase normal">Name</th>
            <th className="uppercase normal">Lane</th>
            <th className="uppercase normal">Progress</th>
  				</tr>
  			</thead>
  			<tbody>
  				{racers && racers.map((racer, i) => (
  					<tr key={racer.id}>
  						<td>
                <div className="margin-auto racer-color"
                style={{
                  backgroundColor: racer.primaryColor
                }}></div>
              </td>
              <td className={racer.injured ? 'strike-name' : ''}>{racer.name}</td>
              <td className="text-center">{racer.lane}</td>
              <td>
                <div className="racer-progress" style={{backgroundColor: racer.primaryColor}}>
                  <ProgressBar progress={racer.percentage} />
                </div>
              </td>
  					</tr>
  				))}
  			</tbody>
  		</table>
  	</div>
  );
}

export default RaceKey;