import React, { Fragment, useContext } from 'react';
import Moment from 'react-moment';
import ResultContext from '../context/result/resultContext';
import Table from 'react-bootstrap/Table';

const ResultsBoard = () => {
  
	const resultContext = useContext(ResultContext);
	const { results } = resultContext;

  return (
  	<Fragment>
  		<div className={`racer-img-${results[0].racerId}`}></div>
      <Table className="white-text" striped bordered hover size="sm">
  			<thead>
  				<tr>
  					<th>Rank</th>
  					<th>Name</th>
  					<th>Time</th>
  				</tr>
  			</thead>
  			<tbody>
  				{results && results.map((result, i) => (
  					<tr key={result.racerId}>
  						<td>{i + 1}</td>
  						<td>{result.name}</td>
  						<td>
  							<Moment 
  								format='mm:ss:SSS'>
  									{result.time}
  							</Moment>
  						</td>
  					</tr>
  				))}
  			</tbody>
  		</Table>
  	</Fragment>
  );
}

export default ResultsBoard;