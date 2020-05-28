'use strict';
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const Racer = sequelize.define('Racer', {
    name: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});

  Racer.associate = function(models) {
    Racer.belongsToMany(models.Race, {
      otherKey: 'raceId',
      foreignKey: 'racerId',
      as: 'races',
      through: models.RacerRace,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
  };

  Racer.getStamina = async function(racer){
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    let stamina = 100;
    let distanceRunToday = 0;
    let placesToday = 0;

    const todayResults = await sequelize.models.RacerRace.findAll({
      where: {
        startTime: {
          [Op.between]: [start, end]
        },
        endTime: {
          [Op.ne]: null
        },
        racerId: racer.id
      }
    });

    const place  = {};
    todayResults.forEach(result => {
      place[result.raceId] = result.place;
    })

    const todayRaces = await sequelize.models.Race.findAll({
      where: {
        id: todayResults.map(racerrace => {
          return racerrace.raceId;
        })
      },
      include: ['Track']
    });
    
    todayRaces.forEach(race => {
      // length of races decreases stamina
      distanceRunToday += race.Track.distance;
      const trackPlace = place[race.id];
      
      // wins increase stamina
      if(trackPlace){
        if(trackPlace === 1){
          placesToday += race.Track.distance;
        } else if(trackPlace === 2){
          placesToday += (race.Track.distance / 2);
        } else if(trackPlace === 3){
          placesToday += (race.Track.distance / 3);
        } else if(trackPlace === null){
          // if injured, decrease stamina more
          distanceRunToday += 5;
        }
      }
    });

    return ( stamina - ( (distanceRunToday - placesToday) / 8) );
  }

  const timeout = 100;
  let ioSocket = null;
  let nextRace = null;
  let message = null;
  let raceInProgress = false;

  const _randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let _mTimeouts = {};
  const _moveRacer = (race, racer, track, racers) => {
    const useStamina = _randomInt(1, 100);
    let stamina = 10;
    let chance = 10000;
    
    // if racer has stamina and odds hit, use stamina
    if(racer.stamina && (useStamina === 3 || useStamina === 6 || useStamina === 9) ){
      stamina = Math.floor( (racer.stamina) / 10);
      chance = _randomInt( (racer.stamina) * 100, chance);
    }
    
    let increment = _randomInt(1, stamina);
    let divisable = track.distance;

    const upperBound = Math.floor(track.distance * 0.95);
    const lowerBound = Math.floor(track.distance * 0.70);

    // use racer strategy
    if(racer.type === 'starter' && racer.RacerRace.percentage < 33){
      divisable = _randomInt(lowerBound, upperBound);
    } else if(racer.type === 'middle' && (racer.RacerRace.percentage >= 33 && racer.RacerRace.percentage <= 66)){
      divisable = _randomInt(lowerBound, upperBound);
    } else if(racer.type === 'finisher' && racer.RacerRace.percentage > 66){
      divisable = _randomInt(lowerBound, upperBound);
    } else {
      // extra boost
      const extraBoost = track.distance * 10;
      if(_randomInt(1, extraBoost) === _randomInt(1, extraBoost)){
        divisable = _randomInt(lowerBound, upperBound);
        // console.log(`${racer.name} extra boost`)
      }
    }

    const injuryChance1 = _randomInt(1, chance);
    const injuryChance2 = _randomInt(1, chance);
    if(injuryChance1 === injuryChance2){
      racer.RacerRace.injured = true;
    } else {
      racer.RacerRace.injured = false;
    }

    // keep racers from moving backwards
    increment = Math.abs(increment);
    divisable = Math.abs(divisable);

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

      racer.RacerRace.finished = true;
    } else {
      _mTimeouts[racer.id] = setTimeout(() => {
        _moveRacer(race, racer, track, racers);
      }, timeout);
    }

    _isRaceFinished(race);
  }

  const _isRaceFinished = async (race) => {
    race.finished = race.racers.every(racer => {
      return racer.RacerRace.finished;
    });
    if(race.finished){    
      // for(key in _mTimeouts){
      //   clearTimeouts(_mTimeouts[key]);
      // }

      raceInProgress = false;
      await _updateRace(race);
      await _updateRacerRaces(race.racers);
    }

    _emitLiveRace(message, race);

    return race.finished;
  }

  const _updateRacerRace = async (racer, index) => {
    const rr = racer.RacerRace;
    rr.endTime = rr.endTime ? moment(rr.endTime) : null;
    rr.duration = rr.duration ? moment(rr.duration).format('mm:ss.SSSS') : null;
    rr.place = rr.duration === null ? null : index + 1;
    
    try {
      // update join table with results
      const res = await sequelize.models.RacerRace.update(rr, {
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
      const res = await sequelize.models.Race.update(race, {
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
        const stamina = await Racer.getStamina(racer);
        racer.stamina = stamina;
      }
    });

    return race;
  }

  const _countdown = (nextRace, nextStartTime) => {
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

    _emitLiveRace(message, nextRace);
  }

  const _initNextRace = (nextRace) => {
    if( nextRace ){
      const nextStartTime = moment(nextRace.startTime);
      _setRacers(nextRace);
      _countdown(nextRace, nextStartTime);
    } else {
      _emitLiveRace('No Races Scheduled for Today.', null);
    }
  }

  const _emitLiveRace = (message, race) => {
    ioSocket.emit('liveRace', {
      message: message,
      race: race
    });
  }

  Racer.move = async (socket) => {
    const dayFromNow = moment().add(24, 'hours');
    ioSocket = socket;

    if(!raceInProgress){
      if(nextRace === null){
        const now = moment();

        // find next race
        const result = await sequelize.models.Race.findAll({
          where: {
            startTime: {
              [Op.gte]: now
            },
            endTime: null
          },
          include: [
            'racers', 'Track'
          ],
          order: [
            ['startTime', 'ASC']
          ],
          limit: 1
        });

        const res = result && result[0] ? result[0] : null;
        nextRace = JSON.parse(JSON.stringify(res));
        _initNextRace(nextRace);   
      } else if(moment(nextRace.startTime).isAfter(moment())){
        _initNextRace(nextRace);
      }
    }
  }

  return Racer;
};