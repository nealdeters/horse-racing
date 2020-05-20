import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import RacerIcon from './RacerIcon';
import Utility from '../Utility';

const Racer = ({ match }) => {
	const [ racer, setRacer ] = useState(null);

	// on mount
	useEffect(() => {
		getTrack(match.params.id);
		Utility.setBackgroundColor();

    // eslint-disable-next-line
	}, []);

	const getTrack = async (id) => {
		const base = window.location.origin;
		const res = await fetch(`${base}/api/racers/${id}`);
		const resT = await fetch(`${base}/api/tracks`);
    let data = await res.json();
    let tracks = await resT.json();

    const now = moment();
    let first = 0;
    let second = 0;
    let third = 0
    let injuries = 0;
    const durations = [];
    
    tracks.forEach(track => {
    	track.starts = 0;
    	track.first = 0;
    	track.second = 0;
    	track.third = 0;
    	track.injuries = 0;
    	track.winPrct = 0;
    })

    const races = data.races.filter(async race => {
      const track = tracks.find(track => track.id === race.trackId);

      if(race.RacerRace.injured){
        injuries++;
        track.injuries++;
      }

      if(race.RacerRace.place === 1){
        first++;
        track.first++;
      } else if(race.RacerRace.place === 2){
        second++;
        track.second++;
      } else if(race.RacerRace.second === 3){
        third++;
        track.third++;
      }

      if(race.startTime && race.endTime){
      	const start = moment(race.startTime);
      	const end = moment(race.endTime);
      	durations.push( end.diff( start ) );
      	track.starts++;
      	return start.isBefore(now)
      }
    });
    let starts = races.length;
    let winPrct = ((first/starts) * 100).toFixed(2);

    data.starts = starts;
    data.first = first;
    data.second = second;
    data.third = third;
    data.winPrct = winPrct === 'NaN' ? 0 : winPrct;
    data.injuries = injuries;
    data.tracks = tracks;
    const totalDurations = durations
    	.slice(1)
    	.reduce((prev, cur) => 
    		moment.duration(cur).add(prev), moment.duration(durations[0])
    	)
    data.avgTime = (totalDurations/ races.length);

    data.tracks.forEach(track => {
    	let winPrct = ((track.first/track.starts) * 100).toFixed(2);
    	track.winPrct = winPrct === 'NaN' ? 0 : winPrct;
    })

    setRacer(data);
	}

	if(racer === null){
		return null;
	}

	return (
		<div className="container racer">
		  <h1 className="header white-text">{racer.name}</h1>
		  <RacerIcon racer={racer} />

		  <table className="racer-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Avg. Time</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
		          data-position="bottom" 
		          data-tooltip="Starts"
		          aria-label="Starts">Sts</th>
		        <th className="uppercase normal">1st</th>
		        <th className="uppercase normal">2nd</th>
		        <th className="uppercase normal">3rd</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
                data-position="bottom" 
                data-tooltip="Did Not Finish"
                aria-label="Did Not Finish">Dnf</th>
		        <th className="uppercase normal tooltipped"
		          data-position="bottom" 
		          data-tooltip="Win Percentage"
		          aria-label="Win Percentage">Win %</th>
		      </tr>
		    </thead>
		    <tbody>
	        <tr>
	          <td>{ moment(racer.avgTime).format('mm:ss.SSSS') }</td>
	          <td className="hide-on-small-only">{racer.starts}</td>
	          <td>{racer.first}</td>
	          <td>{racer.second}</td>
	          <td>{racer.third}</td>
	          <td className="hide-on-small-only">{racer.injuries}</td>
	          <td>{racer.winPrct + '%'}</td>
	        </tr>
		    </tbody>
		  </table>

		  <table className="racer-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Track</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
		          data-position="bottom" 
		          data-tooltip="Starts"
		          aria-label="Starts">Sts</th>
		        <th className="uppercase normal">1st</th>
		        <th className="uppercase normal">2nd</th>
		        <th className="uppercase normal">3rd</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
                data-position="bottom" 
                data-tooltip="Did Not Finish"
                aria-label="Did Not Finish">Dnf</th>
		        <th className="uppercase normal tooltipped"
		          data-position="bottom" 
		          data-tooltip="Win Percentage"
		          aria-label="Win Percentage">Win %</th>
		      </tr>
		    </thead>
		    <tbody>
          {racer.tracks ? racer.tracks.map(track => (
          	<tr key={track.id}>
          		<td>{track.name}</td>
          		<td className="hide-on-small-only">{track.starts}</td>
          		<td>{track.first}</td>
          		<td>{track.second}</td>
          		<td>{track.third}</td>
          		<td className="hide-on-small-only">{track.injuries}</td>
          		<td>{track.winPrct + '%'}</td>
          	</tr>
          )): null}
		    </tbody>
		  </table>

		</div>
	);
}

export default Racer;