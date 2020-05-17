import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';

const Standings = () => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    document.body.style = `background-color: SeaGreen;`;
    getStandings();
  }, []);

  const getStandings = async () => {
    const res = await fetch('api/racers');
    let data = await res.json();
    console.log(data);
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

        return moment(race.startTime).isBefore(now) && race.endTime;
      });
      let starts = races.length + 1;

      racer.starts = starts;
      racer.first = first;
      racer.second = second;
      racer.third = third;
      racer.injuries = injuries;
    })

    // sort array by wins

    setStandings(data);
  }

  return (
    <Fragment>
      <div className="container">
        <table className="standings-board white-text">
          <thead>
            <tr>
              <th className="uppercase normal">Name</th>
              <th className="uppercase normal hide-on-small-only">Color</th>
              <th className="uppercase normal">Starts</th>
              <th className="uppercase normal">1st</th>
              <th className="uppercase normal">2nd</th>
              <th className="uppercase normal">3rd</th>
              <th className="uppercase normal hide-on-small-only">Injuries</th>
            </tr>
          </thead>
          <tbody>
            {standings && standings.map((racer, i) => (
              <tr key={racer.id}>
                <td>
                  <span>{racer.name}</span>
                  <div 
                    className="racer-color hide-on-med-and-up"
                    style={{
                      backgroundColor: racer.primaryColor,
                      display: 'inline-block',
                      marginRight: '10%',
                      float: 'right'
                    }}>
                  </div>
                </td>
                <td class="hide-on-small-only">
                  <div 
                    className="racer-color"
                    style={{
                      backgroundColor: racer.primaryColor,
                    }}>
                  </div>
                </td>
                <td>{racer.starts}</td>
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