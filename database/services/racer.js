const { sequelize, Sequelize } = require('../models');
const { Race, Racer, Track, RacerRace } = sequelize.models;
const Op = Sequelize.Op;
const moment = require('moment');

const timeout = 100;
let ioSocket = null;
let nextRace = null;
let message = null;
let raceInProgress = false;

const _randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let _mTimeout = null
const _moveRacer = (race, racer, track, racers) => {
  // lower stamina decreases performance
  const minimizeDiff = (100 - racer.stamina) / 2;
  const stamina = racer.stamina ? Math.floor( (racer.stamina + minimizeDiff) / 10) : 10;
  const max = _randomInt(stamina, 10);
  const increment = _randomInt(1, max);
  const chance = racer.stamina ? (racer.stamina * 100) : 7000;
  let divisable = track.distance;

  const upperBound = Math.floor(track.distance * 0.90);
  const lowerBound = Math.floor(track.distance * 0.70);

  if(racer.type === 'starter' && racer.RacerRace.percentage < 33){
    divisable = _randomInt(lowerBound, upperBound);
  } else if(racer.type === 'middle' && (racer.RacerRace.percentage >= 33 && racer.RacerRace.percentage <= 66)){
    divisable = _randomInt(lowerBound, upperBound);
  } else if(racer.type === 'finisher' && racer.RacerRace.percentage > 66){
    divisable = _randomInt(lowerBound, upperBound);
  } else {
    if(_randomInt(1, chance) === _randomInt(1, chance)){
      // extra boost
      divisable = _randomInt(lowerBound, upperBound);
    } 
  }

  // lower stamina increases injury odds
  const injuryChance1 = _randomInt(1, chance);
  const injuryChance2 = _randomInt(1, chance);
  if(injuryChance1 === injuryChance2){
    racer.RacerRace.injured = true;
  } else {
    racer.RacerRace.injured = false;
  }

  // ex. 10 / (7..9)
  racer.RacerRace.percentage += (increment / divisable);
  // console.log(`${racer.name} ${racer.RacerRace.percentage}`);

  if(racer.RacerRace.percentage >= 100 || racer.RacerRace.injured){
    if(racer.RacerRace.injured){
      racer.RacerRace.endTime = null;
    } else {
      let endTime = moment();
      racer.RacerRace.percentage = 100;
      racer.RacerRace.endTime = endTime;
      racer.RacerRace.duration = moment(racer.RacerRace.endTime).diff(racer.RacerRace.startTime);
    }

    // clearTimeout(_mTimeout);
    racer.RacerRace.finished = true;
  } else {
    _mTimeout = setTimeout(() => {
      _moveRacer(race, racer, track, racers);
    }, timeout);
  }

  isRaceFinished(race);
}

const isRaceFinished = async (race) => {
  race.finished = race.racers.every(racer => {
    return racer.RacerRace.finished;
  });
  if(race.finished){    
    // clearTimeout(_fTimeout);
    raceInProgress = false;
    await _updateRace(race);
    await _updateRacerRaces(race.racers);
  }

  emitLiveRace(message, race);

  return race.finished;
}

const _updateRacerRace = async (racer, index) => {
  const rr = racer.RacerRace;
  rr.endTime = rr.endTime ? moment(rr.endTime) : null;
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

const _startRace = (race) => {
  raceInProgress = true;
  race.inProgress = true;
  race.finished = false;
  nextRace = null;
  const racers = race.racers;
  const track = race.Track;

  if(race.racers && race.racers.length && race.Track){
    race.racers.forEach(racer => {
      racer.RacerRace.startTime = moment();
      _moveRacer(race, racer, race.Track, race.racers);
    });
  } else {
    race.finished = true;
    race.inProgress = false;
  }
}

const _setRacers = (race) => {
  race.racers.forEach( async (racer, index) => {
    if(typeof racer.RacerRace.percentage === 'undefined'){
      racer.RacerRace.percentage = 0;
      if(!racer.RacerRace.lane){
        racer.RacerRace.lane = index + 1;
      }
    }

    if(!racer.stamina){
      const stamina = await Racer.prototype.getStamina(racer);
      racer.stamina = stamina;
    }
  });

  return race;
}

const countdown = (nextRace, nextStartTime) => {
  let time = nextStartTime.diff(moment(), 'seconds');

  if(time >= 60){
    let fromNow = nextStartTime.fromNow();
    message = `${fromNow}`;
  } else {
    if(time === 0){
      _startRace(nextRace);
      message = null;
    } else if (time >= 10){
      message = `00:${time}`;
    } else {
      message = `00:0${time}`;
    }
  }

  emitLiveRace(message, nextRace);
}

const initNextRace = (nextRace) => {
  if( nextRace ){
    const nextStartTime = moment(nextRace.startTime);
    _setRacers(nextRace);
    countdown(nextRace, nextStartTime);
  } else {
    emitLiveRace('No Races Scheduled for Today.', null);
  }
}

const racerCronJob = async (socket) => {
  const dayFromNow = moment().add(24, 'hours');
  ioSocket = socket;

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
      initNextRace(nextRace);   
    } else if(moment(nextRace.startTime).isAfter(moment())){
      initNextRace(nextRace);
    }
  }
}

const emitLiveRace = (message, race) => {
  ioSocket.emit('liveRace', {
    message: message,
    race: race
  });
}

module.exports = {
  racerCronJob
}