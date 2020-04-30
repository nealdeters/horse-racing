import React from 'react';
import Table from 'react-bootstrap/Table';

const RaceKey = (props) => {
  const { racers } = props;

  return (
    <div className="race-key">
      <Table className="white-text" striped hover size="sm">
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
                  backgroundColor: racer.color
                }}></div>
              </td>
  						<td>{racer.name}</td>
  					</tr>
  				))}
  			</tbody>
  		</Table>
  	</div>
  );
}

export default RaceKey;