const { sequelize, Sequelize } = require('./database/models');
const { Race, Racer, Track, RacerRace } = sequelize.models;
const Op = Sequelize.Op;
const moment = require('moment');

const debugging = false;
const timeout = 100;
let raceFinished = false;
let raceInProgress = false;
let nextRace = null;
let message = null;

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

  const injuryChance = 7000;
  const injuryChance1 = _randomInt(1, injuryChance);
  const injuryChance2 = _randomInt(1, injuryChance);
  if(injuryChance1 === injuryChance2){
    racer.RacerRace.injured = true;
  } else {
    racer.RacerRace.injured = false;
  }

  racer.RacerRace.percentage += (increment / divisable);

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
    }, timeout);
  }
}

const isRaceFinished = async (race, socket) => {
  raceFinished = race.racers.every(racer => {
    return racer.RacerRace.finished;
  });
  if(raceFinished){
    raceInProgress = false;
    await _updateRace(race);
    await _updateRacerRaces(race.racers);
    race.finished = true;
    socket.emit('raceResults', race);
  } else {
    setTimeout(() => {
      isRaceFinished(race, socket);
      socket.emit('raceResults', race);
    }, timeout);
  }

  return raceFinished;
}

const _updateRacerRaces = (racers) => {
  // sort racers by duration
  racers.sort((a, b) => {
    // nulls sort after anything else
    if (a.RacerRace.duration === null) {
      return 1;
    } else if (b.RacerRace.duration === null) {
      return -1;
    } else if ( a.RacerRace.duration < b.RacerRace.duration) {
      return -1;
    } else if ( a.RacerRace.duration > b.RacerRace.duration) {
      return 1;
    } else {
      return 0;
    }
  });

  const _updateRacerRace = async (racer, index) => {
    const rr = racer.RacerRace;
    rr.endTime = moment(rr.endTime).toISOString();
    rr.duration = rr.duration ? moment(rr.duration).format('mm:ss.SSSS') : null;
    rr.place = rr.duration === null ? null : index + 1;
    
    try {
      // update join table with results
      const res = await RacerRace.update(rr, {
        where: {raceId: rr.raceId, racerId: rr.racerId}
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  // call to update racerRaces
  racers.forEach(_updateRacerRace);
}

const _updateRace = async (race) => {
  race.endTime = moment().toISOString();
  const updatedRace = {
    id: race.id,
    endTime: race.endTime
  }

  try {
    // update race table with end time
    const res = await Race.update(race, {
      where: {id: updatedRace.id}
    });
  } catch (err) {
    console.error(err.message);
  }
}

const _startRace = (race, socket) => {
  raceInProgress = true;
  raceFinished = false;
  nextRace = null;
  const racers = race.racers;
  const track = race.Track;

  if(race.racers && race.racers.length && race.Track){
    race.racers.forEach(racer => {
      racer.RacerRace.startTime = moment();
      _moveRacer(racer, race.Track, race.racers);
    });

    isRaceFinished(race, socket);
  } else {
    raceFinished = true;
    raceInProgress = false;
  }
}

const _setRacerLanes = (race) => {
  race.racers.forEach( (racer, index) => {
    racer.RacerRace.percentage = 0;
    racer.RacerRace.lane = index + 1;
  });

  return race;
}

const countdown = (nextRace, nextStartTime, socket) => {
  let time = nextStartTime.diff(moment(), 'seconds');

  if(time >= 60){
    let fromNow = nextStartTime.fromNow();
    message = `${fromNow}`;
    socket.emit('nextRaceCountdown', message);
  } else {
    if(time === 1){
      _startRace(nextRace, socket);
      socket.emit('nextRaceCountdown', null);
    } else if (time >= 10){
      message = `00:${time}`;
      socket.emit('nextRaceCountdown', message);
    } else {
      message = `00:0${time}`;
      socket.emit('nextRaceCountdown', message);
    }
  }
}

const initNextRace = (nextRace, socket) => {
  if( nextRace ){
    const nextStartTime = moment(nextRace.startTime);
    _setRacerLanes(nextRace);
    socket.emit('raceResults', nextRace);
    countdown(nextRace, nextStartTime, socket);
  } else {
    socket.emit('raceResults', null);
    socket.emit('nextRaceCountdown', 'No Races Scheduled for Today.');
  }
}

const racerCronJob = async (socket) => {
  const dayFromNow = moment().add(24, 'hours');

  if(!raceInProgress){
    if(nextRace === null){
      const now = moment();

      // find next race
      const result = await Race.findAll({
        where: {
          startTime: {
            [Op.gte]: now
          },
          endTime: null
        },
        include: [
          {
            model: Racer, 
            as: 'racers'
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
      nextRace = JSON.parse(JSON.stringify(res));
      initNextRace(nextRace, socket);   
    } else if(moment(nextRace.startTime).isAfter(moment())){
      initNextRace(nextRace, socket);
    }
  } 
  // else {
  //   console.log('race still in progress')
  // }
}

module.exports = {
  racerCronJob
}