import React, { Fragment, useContext } from 'react';
import RaceContext from '../context/race/raceContext';
import Moment from 'react-moment';

const ResultsBoard = (props) => {
  const raceContext = useContext(RaceContext);
  const { results } = raceContext;

  if(results === null){
    return null;
  }

  return (
  	<Fragment>
  		<div 
        className="fas fa-horse fa-flip-horizontal racer-default-img"
        style={{
          backgroundColor: results === null ? 'white' : results[0].colors.primary,
          color: results === null ? 'white' : results[0].colors.secondary
        }}
        ></div>
      <table className="white-text">
  			<thead>
  				<tr>
  					<th>Rank</th>
            <th>Color</th>
  					<th>Name</th>
  					<th>Time</th>
  				</tr>
  			</thead>
  			<tbody>
  				{results && results.map((result, i) => (
  					<tr key={result.racerId}>
  						<td>{i + 1}</td>
              <td>
                <div 
                  className="racer-color"
                  style={{
                    backgroundColor: result.colors.primary
                  }}>
                </div>
              </td>
  						<td className={result.injured ? 'strike-name' : ''}>{result.name}</td>
  						<td>
  							{result.time === null ? '-' : (
                  <Moment 
                    format='mm:ss:SSS'>
                      {result.time}
                  </Moment>
                )}
  						</td>
  					</tr>
  				))}
  			</tbody>
  		</table>
  	</Fragment>
  );
}

export default ResultsBoard;