import React, { Fragment, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import RacerName from '../components/RacerName';
import RaceCountdown from '../components/RaceCountdown';
import Utility from '../services/Utility';

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    Utility.setBackgroundColor();
    getStandings();

    // on dismount
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getStandings = async () => {
    try {
      const res = await fetch('api/racers');
      let data = await res.json();
      
      if(isMountedRef.current){
        const now = moment();

        // collection data
        data.forEach(racer => {
          let first = 0;
          let second = 0;
          let third = 0
          let injuries = 0;
          const races = racer.races.filter(race => {
            if(race.RacerRace.injured){
              injuries++;
            }

            if(race.RacerRace.place === 1){
              first++;
            } else if(race.RacerRace.place === 2){
              second++;
            } else if(race.RacerRace.place === 3){
              third++;
            }

            if(race.startTime && race.endTime){
              return moment(race.startTime).isBefore(now);
            } else {
              return false;
            }
          });
          let starts = races.length;
          let winPrct = ((first/starts) * 100).toFixed(2);

          racer.starts = starts;
          racer.first = first;
          racer.second = second;
          racer.third = third;
          racer.winPrct = winPrct === 'NaN' ? 0 : winPrct;
          racer.injuries = injuries;
        });

        // sort array by wins
        data.sort((a, b) => {
          return b.winPrct - a.winPrct || b.first - a.first || b.second - a.second || 
            b.third - a.third;
        });

        setStandings(data);
      }
    } catch (err){
      console.error(err);
    }
  }

  return (
    <Fragment>
      <div className="container standings">
        <h1 className="header white-text">Standings</h1>
        <RaceCountdown alwaysShow={true} />

        <table className="standings-board white-text">
          <thead>
            <tr>
              <th className="uppercase normal">Name</th>
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
              <th className="uppercase normal">3rd</th>
              <th className="uppercase normal tooltipped hide-on-small-only"
                data-position="bottom" 
                data-tooltip="Did Not Finish"
                aria-label="Did Not Finish">Dnf</th>
            </tr>
          </thead>
          <tbody>
            {standings && standings.map((racer, i) => (
              <tr key={racer.id}>
                <td>
                  <RacerName racer={racer} strikeName={false} />
                </td>
                <td className="hide-on-small-only">{racer.starts}</td>
                <td>{racer.winPrct + '%'}</td>
                <td>{racer.first}</td>
                <td>{racer.second}</td>
                <td>{racer.third}</td>
                <td className="hide-on-small-only">{racer.injuries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default Standings;