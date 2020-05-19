import React, { Fragment, useEffect, useState } from 'react';
import RaceWinner from '../components/RaceWinner';

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
  		<RaceWinner racers={results.racers}/>
      <table className="white-text">
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
  						<td>{result.RacerRace.place}</td>
              <td>
                <span className={result.RacerRace.injured ? 'strike-name' : ''}>{result.name}</span>
                <div 
                  className="racer-color"
                  style={{
                    backgroundColor: result.primaryColor,
                    display: 'inline-block',
                    marginRight: '10%',
                    float: 'right'
                  }}>
                </div>  
              </td>
              <td>{result.RacerRace.lane}</td>
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