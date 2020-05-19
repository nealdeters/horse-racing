import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";

const Schedule = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    document.body.style = `background-color: SeaGreen;`;
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
      <div className="container">
        <h1 className="header white-text track-name">Schedule</h1>
        <table className="schedule-board white-text">
          <thead>
            <tr>
              <th className="uppercase normal">Start Time</th>
              <th className="uppercase normal">Track</th>
              <th className="uppercase normal">Distance</th>
              <th className="uppercase normal"># Racers</th>
            </tr>
          </thead>
          <tbody>
            {races && races.map((race, i) => (
              <tr key={race.id}>
                <td>
                  <Link 
                    className="schedule-link"
                    to={`/races/${race.id}`}>{moment(race.startTime).format('lll')}</Link>
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