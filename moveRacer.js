const { sequelize, Sequelize } = require('./database/models');
const { Race, Racer, Track } = sequelize.models;
const Op = Sequelize.Op;
const moment = require('moment');

const debugging = false;
let raceFinished = false;
let raceInProgress = false;

const _randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const _moveRacer = (racer, track, racers) => {
  const increment = _randomInt(1, 10);
  let divisable = null;

  if(debugging){
    divisable = 1;
  } else {
    divisable = track.distance;

    const upperBound = Math.floor(track.distance * 0.90);
    const lowerBound = Math.floor(track.distance * 0.70);

    if(racer.type === 'starter' && racer.RacerRace.percentage < 33){
      divisable = _randomInt(lowerBound, upperBound);
    } else if(racer.type === 'middle' && (racer.RacerRace.percentage >= 33 && racer.RacerRace.percentage <= 66)){
      divisable = _randomInt(lowerBound, upperBound);
    } else if(racer.type === 'finisher' && racer.RacerRace.percentage > 66){
      divisable = _randomInt(lowerBound, upperBound);
    }
  }

  const injuryChance = 2000;
  const injuryChance1 = _randomInt(1, injuryChance);
  const injuryChance2 = _randomInt(1, injuryChance);
  if(injuryChance1 === injuryChance2){
    racer.RacerRace.injured = true;
  } else {
    racer.RacerRace.injured = false;
  }

  racer.RacerRace.percentage += (increment / divisable);
  console.log(racer.RacerRace.percentage)

  if(racer.RacerRace.percentage >= 100 || racer.RacerRace.injured){
    if(racer.RacerRace.injured){
      racer.RacerRace.endTime = null;
    } else {
      let endTime = moment();
      racer.RacerRace.percentage = 100;
      racer.RacerRace.endTime = endTime;
      racer.RacerRace.duration = moment(racer.RacerRace.endTime).diff(racer.RacerRace.startTime);
    }

    racer.RacerRace.finished = true;
  } else {
    setTimeout(() => {
      _moveRacer(racer, track, racers);
    }, 100);
  }
}

const isRaceFinished = (race, raceInProgress, raceFinished) => {
  raceFinished = race.racers.every(racer => {
    return racer.RacerRace.finished;
  });
  console.log(isRaceFinished)
  if(raceFinished){
    raceInProgress = false;
    _updateRace(race);
    _updateRacerRaces(race.racers);
  } else {
    setTimeout(() => {
      isRaceFinished(race, raceInProgress, raceFinished);
    }, 1000);
  }

  return raceFinished;
}

const _updateRacerRaces = (racers) => {
  // racers.sort((a, b) => {
  //   // nulls sort after anything else
  //   if (a.RacerRace.duration === null) {
  //     return 1;
  //   } else if (b.RacerRace.duration === null) {
  //     return -1;
  //   } else if ( a.RacerRace.duration < b.RacerRace.duration) {
  //     return -1;
  //   } else if ( a.RacerRace.duration > b.RacerRace.duration) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // });
  console.log(racers)
}

const _updateRace = (race) => {
  race.endTime = moment().toISOString();
  console.log(race)
}

const _startRace = (race) => {
  raceFinished = false;
  const racers = race.racers;
  const track = race.Track;
  console.log(race)
  if(race.racers && race.racers.length && race.Track){
    raceInProgress = true;
    race.racers.forEach(racer => {
      racer.RacerRace.startTime = moment();
      racer.RacerRace.percentage = 0;
      _moveRacer(racer, race.Track, race.racers);
    });

    isRaceFinished(race, raceInProgress, raceFinished);
  } else {
    raceFinished = true;
  }
}

const racerCronJob = async () => {
  const endOfDay = moment().endOf('day');

  if(!raceInProgress){
    const now = moment();

    // find upcoming race
    // return racers and racerraces with data
    // limit to only those with endTime = null
    // order by startTime ascending
    const result = await Race.findAll({
      where: {
        startTime: {
          [Op.between]: [now, endOfDay]
        },
        endTime: null
      },
      include: [
        {
          model: Racer, 
          as: 'racers',
          through: {
            // attributes: []
          }
        },{
          model: Track
        }
      ],
      order: [
        ['startTime', 'ASC']
      ],
      limit: 1
    });

    const res = result && result[0] ? result[0] : null;
    // const startTime = moment(res.startTime);
    
    if( res ){
      const nextRace = JSON.parse(JSON.stringify(res));
      const nextStartTime = moment(nextRace.startTime);
      // const tenFromRace = moment(nextStartTime).add(10, 'minutes');

      // if next race now 
      if(nextStartTime.isSame(now, 'minute')){
        // begin race calculations
        // pass websocket for results
        console.log('race starts now')
        _startRace(nextRace);
      } else {
        // pass websocket to start timer
        // shuffle racers and set lanes
        console.log(`next race starts ${nextStartTime.fromNow()}`);
      }
    }
  } else {
    console.log('race in progress still')
  }
}

module.exports = {
  racerCronJob
}