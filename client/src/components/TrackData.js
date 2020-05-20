import React, { useState, useEffect } from 'react';
import Track from '../components/Track';
import moment from 'moment';
import Utility from '../Utility';

const TrackData = ({ match }) => {
	const [ track, setTrack ] = useState(null);
	const [ avgTime, setAvgTime ] = useState(null);
	const [ races, setRaces ] = useState([]);

	// on mount
	useEffect(() => {
		getTrack(match.params.id);

    // eslint-disable-next-line
	}, []);

	const getTrack = async (id) => {
		const base = window.location.origin;
		const res = await fetch(`${base}/api/tracks/${id}`);
    let data = await res.json();
    setTrack(data);
    if(data){
	  	Utility.setBackgroundColor(data.trackColor);
	  }

	  if(data.race){
	  	const durations = [];
	  	const fullRaces = [];
	  	data.race.forEach(r => {
	  		if(r.startTime && r.endTime){
	  			durations.push( moment(r.endTime).diff( moment(r.startTime) ) );
	  			fullRaces.push(r);
	  		}
	  	})

	  	const totalDurations = durations
	  		.slice(1)
	  		.reduce((prev, cur) => 
	  			moment.duration(cur).add(prev), moment.duration(durations[0])
	  		)
	  	const avg = (totalDurations/ fullRaces.length);
	  	setAvgTime(avg);
	  	setRaces(fullRaces);
	  }
	}

	if(track === null){
		return null;
	}

	return (
		<div className="container track"
		  style={{
		    backgroundColor: track.trackColor,
		    minHeight: `100%`
		  }}>
		  <h1 className="header white-text">{track.name}</h1>

		  <Track track={track} />

		  <table className="track-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Races</th>
		        <th className="uppercase normal">Distance</th>
		        <th className="uppercase normal">Avg. Time</th>
		      </tr>
		    </thead>
		    <tbody>
	        <tr>
	          <td>{races.length}</td>
	          <td>{track.distance}</td>
	          <td>{avgTime ? moment(avgTime).format('mm:ss.SSSS') : '-'}</td>
	        </tr>
		    </tbody>
		  </table>
		</div>
	);
}

export default TrackData;