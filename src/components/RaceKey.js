import React from 'react';

const RaceKey = (props) => {
  const { racers } = props;

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
  						<td>{i + 1}</td>
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