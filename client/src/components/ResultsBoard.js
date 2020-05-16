import React, { Fragment } from 'react';

const ResultsBoard = (props) => {
  const { results } = props;

  if(results === null){
    return null;
  }

  return (
  	<Fragment>
  		<div 
        className="fas fa-horse fa-flip-horizontal racer-default-img"
        style={{
          backgroundColor: results === null ? 'white' : results[0].primaryColor,
          color: results === null ? 'white' : results[0].secondaryColor
        }}
        ></div>
      <h3 className="white-text text-center">{results[0].name} Wins!</h3>
      <table className="white-text">
  			<thead>
  				<tr>
  					<th className="uppercase normal">Rank</th>
            <th className="uppercase normal">Color</th>
  					<th className="uppercase normal">Name</th>
            <th className="uppercase normal">Lane</th>
  					<th className="uppercase normal">Time</th>
  				</tr>
  			</thead>
  			<tbody>
  				{results && results.map((result, i) => (
  					<tr key={result.id}>
  						<td>{result.RacerRace.place}</td>
              <td>
                <div 
                  className="racer-color"
                  style={{
                    backgroundColor: result.primaryColor
                  }}>
                </div>
              </td>
  						<td className={result.RacerRace.injured ? 'strike-name' : ''}>{result.name}</td>
              <td>{result.RacerRace.lane}</td>
  						<td>
                <Fragment>{result.RacerRace.duration}</Fragment>
  						</td>
  					</tr>
  				))}
  			</tbody>
  		</table>
  	</Fragment>
  );
}

export default ResultsBoard;