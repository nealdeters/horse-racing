import React, { Fragment, useEffect, useState } from 'react';
import RacerName from '../components/RacerName';

const ResultsBoard = (props) => {
  const { results } = props;
  const [sortedResults, setSortedResults] = useState(null);

  // on mount
  useEffect(() => {
    if(results){
      results.sort((a, b) => {
        return (
          a.RacerRace.place === null) - (b.RacerRace.place === null) 
            || 
          + (a.RacerRace.place > b.RacerRace.place)
            ||
          - (a.RacerRace.place < b.RacerRace.place);
      });
      setSortedResults(results);
    }

    // eslint-disable-next-line
  }, []);

  if(results === null){
    return null;
  }

  return (
  	<Fragment>
      <table className="results-board white-text">
  			<thead>
  				<tr>
  					<th className="uppercase normal">Place</th>
  					<th className="uppercase normal">Name</th>
            <th className="uppercase normal">Lane</th>
  					<th className="uppercase normal">Time</th>
  				</tr>
  			</thead>
  			<tbody>
  				{sortedResults && sortedResults.map((result, i) => (
  					<tr key={result.id}>
  						<td>
                <Fragment>{result.RacerRace.place ? result.RacerRace.place : '-'}</Fragment>      
              </td>
              <td>
                <RacerName racer={result} strikeName={true} />  
              </td>
              <td>
                <Fragment>{result.RacerRace.lane ? result.RacerRace.lane : '-'}</Fragment>
              </td>
  						<td>
                <Fragment>{result.RacerRace.duration ? result.RacerRace.duration : '-'}</Fragment>
  						</td>
  					</tr>
  				))}
  			</tbody>
  		</table>
  	</Fragment>
  );
}

export default ResultsBoard;