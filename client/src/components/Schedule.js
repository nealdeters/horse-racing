import React, { Fragment, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import RaceCountdown from '../components/RaceCountdown';
import Utility from '../Utility';

const Schedule = () => {
  const [races, setRaces] = useState([]);
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    Utility.setBackgroundColor();
    getRaces();

    // on dismount
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getRaces = async () => {
    try {
      const res = await fetch(`api/races/schedule`);
      let data = await res.json();

      if(isMountedRef.current){
        setRaces(data);
      }
    } catch (err){
      console.error(err);
    }
  }

  return (
    <Fragment>
      <div className="container schedule">
        <h1 className="header white-text">Schedule</h1>
        <RaceCountdown alwaysShow={true} />
        <table className="schedule-board white-text">
          <thead>
            <tr>
              <th className="uppercase normal">Start</th>
              <th className="uppercase normal">Track</th>
              <th className="uppercase normal tooltipped" 
                data-position="bottom" 
                data-tooltip="Distance"
                aria-label="Distance">Dist</th>
              <th className="uppercase normal">Racers</th>
            </tr>
          </thead>
          <tbody>
            {races && races.map((race, i) => (
              <tr key={race.id}>
                <td>
                  <Link 
                    className="schedule-link"
                    to={`/races/${race.id}`}>{moment(race.startTime).format('ddd @ LT')}
                  </Link>
                </td>
                <td>
                  <Link
                    className="schedule-link"
                    to={`/tracks/${race.Track.id}`}>
                    {race.Track.name}
                  </Link>
                </td>
                <td>{race.Track.distance}</td>
                <td>{race.racers.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default Schedule;