import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import RaceCountdown from '../components/RaceCountdown';
import Utility from '../Utility';

const Schedule = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    Utility.setBackgroundColor();
    getRaces();
  }, []);

  const getRaces = async () => {
    const res = await fetch(`api/races/schedule`);
    let data = await res.json();
    console.log(data)

    setRaces(data);
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
              <th className="uppercase normal">Distance</th>
              <th className="uppercase normal">Racers</th>
            </tr>
          </thead>
          <tbody>
            {races && races.map((race, i) => (
              <tr key={race.id}>
                <td>
                  <Link 
                    className="schedule-link"
                    to={`/races/${race.id}`}>{moment(race.startTime).format('LT')}
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