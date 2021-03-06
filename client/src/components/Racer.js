import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import RacerIcon from './RacerIcon';
import Utility from '../services/Utility';
import { Link } from "react-router-dom";

const Racer = ({ match }) => {
	const [ racer, setRacer ] = useState(null);
  const isMountedRef = useRef(null);


	// on mount
	useEffect(() => {
		isMountedRef.current = true;
    getTrack(match.params.id);
		Utility.setBackgroundColor();

    // on dismount
    return () => {
      isMountedRef.current = false;
    };

    // eslint-disable-next-line
	}, []);

	const getTrack = async (id) => {
		try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/racers/${id}`);
      const resT = await fetch(`${base}/api/tracks`);
      let data = await res.json();
      let tracks = await resT.json();

      if(isMountedRef.current){
        const now = moment();
        let first = 0;
        let second = 0;
        let third = 0
        let injuries = 0;
        let stsToday = 0;
        const durations = [];
        
        tracks.forEach(track => {
          track.starts = 0;
          track.first = 0;
          track.second = 0;
          track.third = 0;
          track.injuries = 0;
          track.winPrct = 0;
          track.time = 0;
        })

        const races = data.races.filter(race => {
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
          } else if(race.RacerRace.place === 3){
            third++;
            track.third++;
          }

          if(race.startTime && race.endTime){
            if( moment(race.startTime).isBefore(now) ){
              const start = moment(race.RacerRace.startTime);
              const end = moment(race.RacerRace.endTime);
              const duration = end.diff( start );
              durations.push(duration);
              track.starts++;
              track.time += duration ? duration : 0;

              if(start.isSame(moment(), 'day')){
                stsToday++;
              }

              return true;
            } else {
              return false;
            }
          } else {
            return false;
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
        data.stsToday = stsToday;

        const totalDurations = durations
          .slice(1)
          .reduce((prev, cur) => 
            moment.duration(cur).add(prev), moment.duration(durations[0])
          )
        data.avgTime = (totalDurations/ starts);

        data.tracks.forEach(track => {
          let winPrct = ((track.first/track.starts) * 100).toFixed(2);
          track.winPrct = winPrct === 'NaN' ? 0 : winPrct;
          track.avgTime = (track.time/ track.starts);
        });

        // sort array by wins
        data.tracks.sort((a, b) => {
          return b.winPrct - a.winPrct || b.first - a.first || b.second - a.second || 
            b.third - a.third;
        })

        setRacer(data);
      }
    } catch (err){
      console.error(err);
    }
	}

	if(racer === null){
		return null;
	}

	return (
		<div className="container racer">
		  <h1 className="header white-text">{racer.name}</h1>
		  <RacerIcon racer={racer ? racer : null} />

      <table className="racer-board white-text">
        <thead>
          <tr>
            <th className="uppercase normal tooltipped"
              data-position="bottom" 
              data-tooltip="Starts Today"
              aria-label="Starts Today">Sts Today</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{racer.stsToday}</td>
          </tr>
        </tbody>
      </table>

		  <table className="racer-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Type</th>
		        <th className="uppercase normal tooltipped"
		        	data-position="bottom" 
		        	data-tooltip="Average Race Time"
		        	aria-label="Average Race Time">Avg</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
		          data-position="bottom" 
		          data-tooltip="Starts"
		          aria-label="Starts">Sts</th>
		        <th className="uppercase normal tooltipped"
		          data-position="bottom" 
		          data-tooltip="Win Percentage"
		          aria-label="Win Percentage">Win</th>
		        <th className="uppercase normal">1st</th>
		        <th className="uppercase normal">2nd</th>
		        <th className="uppercase normal hide-on-small-only">3rd</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
                data-position="bottom" 
                data-tooltip="Did Not Finish"
                aria-label="Did Not Finish">Dnf</th>
		      </tr>
		    </thead>
		    <tbody>
	        <tr>
	          <td>{racer.type}</td>
	          <td>{ racer.avgTime ? moment(racer.avgTime).format('mm:ss.SSSS') : '-'}</td>
	          <td className="hide-on-small-only">{racer.starts}</td>
	          <td>{racer.winPrct + '%'}</td>
	          <td>{racer.first}</td>
	          <td>{racer.second}</td>
	          <td className="hide-on-small-only">{racer.third}</td>
	          <td className="hide-on-small-only">{racer.injuries}</td>
	        </tr>
		    </tbody>
		  </table>

		  <table className="racer-board white-text">
		    <thead>
		      <tr>
		        <th className="uppercase normal">Track</th>
		        <th className="uppercase normal tooltipped"
		        	data-position="bottom" 
		        	data-tooltip="Average Race Time"
		        	aria-label="Average Race Time">Avg</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
		          data-position="bottom" 
		          data-tooltip="Starts"
		          aria-label="Starts">Sts</th>
		        <th className="uppercase normal tooltipped"
		          data-position="bottom" 
		          data-tooltip="Win Percentage"
		          aria-label="Win Percentage">Win</th>
		        <th className="uppercase normal">1st</th>
		        <th className="uppercase normal">2nd</th>
		        <th className="uppercase normal hide-on-small-only">3rd</th>
		        <th className="uppercase normal tooltipped hide-on-small-only"
                data-position="bottom" 
                data-tooltip="Did Not Finish"
                aria-label="Did Not Finish">Dnf</th>
		      </tr>
		    </thead>
		    <tbody>
          {racer.tracks ? racer.tracks.map(track => (
          	<tr key={track.id}>
          		<td>
          			<Link className="schedule-link" 
          				to={`/tracks/${track.id}`}>
                  {track.name}
                </Link>
              </td>
              <td>{ track.avgTime ? moment(track.avgTime).format('mm:ss.SSSS') : '-'}</td>
          		<td className="hide-on-small-only">{track.starts}</td>
          		<td>{track.winPrct + '%'}</td>
          		<td>{track.first}</td>
          		<td>{track.second}</td>
          		<td className="hide-on-small-only">{track.third}</td>
          		<td className="hide-on-small-only">{track.injuries}</td>
          	</tr>
          )): null}
		    </tbody>
		  </table>

		</div>
	);
}

export default Racer;