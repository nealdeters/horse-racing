import React, { useState, useEffect } from 'react';
// import Track from '../components/Track';
import ResultsBoard from '../components/ResultsBoard';
import RaceWinner from '../components/RaceWinner';
import Utility from '../Utility';

import moment from 'moment';

const Race = ({ match }) => {
	const [ race, setRace ] = useState(null);

	// on mount
	useEffect(() => {
		getRace(match.params.id);
		Utility.setBackgroundColor();

    // eslint-disable-next-line
	}, []);

	const getRace = async (id) => {
		const base = window.location.origin;
		const res = await fetch(`${base}/api/races/${id}`);
    let data = await res.json();
    setRace(data);
	}

	if(race === null){
		return null;
	}

	return (
		<div className="container race">
		  <h1 className="header white-text track-name">Race #{race.id}</h1>
		  
		  <RaceWinner racers={race.racers}/>

		  <table className="schedule-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Start Time</th>
		        <th className="uppercase normal">End Time</th>
		        <th className="uppercase normal">Track</th>
		        <th className="uppercase normal">Distance</th>
		      </tr>
		    </thead>
		    <tbody>
	        <tr>
	          <td>{moment(race.startTime).format('lll')}</td>
	          <td>{ race.endTime ? moment(race.endTime).format('lll') : '-'}</td>
	          <td>{race.Track.name}</td>
	          <td>{race.Track.distance}</td>
	        </tr>
		    </tbody>
		  </table>

		  <div className="results-board">
		  	<ResultsBoard id="results-board" results={race.racers}/>
		  </div>
		</div>
	);
}

export default Race;