import React, { Fragment, useRef, useState, useEffect } from 'react';
import Track from '../components/Track';
import moment from 'moment';
import Utility from '../services/Utility';

const TrackData = ({ match }) => {
	const [ track, setTrack ] = useState(null);
	const [ avgTime, setAvgTime ] = useState(null);
	const [ races, setRaces ] = useState([]);
	const isMountedRef = useRef(null);

	// on mount
	useEffect(() => {
		isMountedRef.current = true;
		getTrack(match.params.id);

		// on dismount
		return () => {
		  isMountedRef.current = false;
		};

    // eslint-disable-next-line
	}, []);

	const getTrack = async (id) => {
		try {
			const base = window.location.origin;
			const res = await fetch(`${base}/api/tracks/${id}`);
	    let data = await res.json();
	    
	    if(isMountedRef.current){
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
		} catch (err){
			console.error(err);
		}
	}

	if(track === null){
		return null;
	}

	return (
		<Fragment>
			<h1 className="header white-text">{track.name}</h1>

			<Track track={track} />

			<div className="container track"
			  style={{
			    backgroundColor: track.trackColor,
			    minHeight: `100%`
			  }}>
			  
			  <table className="track-board white-text">
			    <thead>
			      <tr>
			        <th className="uppercase normal tooltipped" 
			        	data-position="bottom" 
                data-tooltip="Starts"
                aria-label="Starts">Sts</th>
			        <th className="uppercase normal"
			        	data-position="bottom" 
                data-tooltip="Starts"
                aria-label="Starts">Dist</th>
			        <th className="uppercase normal"
			        	data-position="bottom" 
                data-tooltip="Average Time."
                aria-label="Average Time.">Avg</th>
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
		</Fragment>
	);
}

export default TrackData;