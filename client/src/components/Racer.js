import React, { useState, useEffect } from 'react';
import moment from 'moment';
import RacerIcon from './RacerIcon';

const Racer = ({ match }) => {
	const [ racer, setRacer ] = useState(null);

	// on mount
	useEffect(() => {
		getTrack(match.params.id);
		document.body.style = `background-color: SeaGreen;`;

    // eslint-disable-next-line
	}, []);

	const getTrack = async (id) => {
		const base = window.location.origin;
		const res = await fetch(`${base}/api/racers/${id}`);
    let data = await res.json();

    console.log(data)

    // avg time

    // total races

    // 1st

    // 2nd

    // 3rd

    // DNF

    // Win %

    // best track

    setRacer(data);
	}

	if(racer === null){
		return null;
	}

	return (
		<div className="container racer">
		  <h1 className="header white-text track-name">{racer.name}</h1>
		  <RacerIcon racer={racer} />

		  <table className="racer-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Avg. Time</th>
		        <th className="uppercase normal">STS</th>
		        <th className="uppercase normal">1st</th>
		        <th className="uppercase normal">2nd</th>
		        <th className="uppercase normal">3rd</th>
		        <th className="uppercase normal">DNF</th>
		        <th className="uppercase normal">Win %</th>
		      </tr>
		    </thead>
		    <tbody>
	        <tr>
	          <td>sdfa</td>
	          <td>sdfa</td>
	          <td>sdfa</td>
	          <td>sdfa</td>
	          <td>sdfa</td>
	          <td>sdfa</td>
	          <td>sdfa</td>
	        </tr>
		    </tbody>
		  </table>
		</div>
	);
}

export default Racer;