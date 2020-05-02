import React, { useContext } from 'react';
import RaceContext from '../context/race/raceContext';

const RaceKey = (props) => {
  const raceContext = useContext(RaceContext);
  const { racers } = raceContext;

  return (
    <div className="race-key">
      <table className="white-text">
  			<thead>
  				<tr>
  					<th>Lane</th>
            <th>Color</th>
  					<th>Name</th>
  				</tr>
  			</thead>
  			<tbody>
  				{racers && racers.map((racer, i) => (
  					<tr key={racer.id}>
  						<td>{racer.lane}</td>
              <td>
                <div className="racer-color"
                style={{
                  backgroundColor: racer.colors.primary
                }}></div>
              </td>
  						<td
                className={racer.injured ? 'strike-name' : ''}>{racer.name}</td>
  					</tr>
  				))}
  			</tbody>
  		</table>
  	</div>
  );
}

export default RaceKey;