const moment = require('moment');
const { sequelize, Sequelize } = require('../models');
// const sqs = require('sequelize-querystring');
const { Race, RacerRace, Racer, Track } = require('../models');
const Op = Sequelize.Op;

const _shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const createRace = async (req, res) => {
  try {
    const {startTime, endTime, racers, track} = req.body;
    let trackId = null;
    let tId = null

    const time = moment(startTime);
    const fiveFromTime = moment(time).add(5, 'minutes');
    let raceInRange = await Race.findAll({
      where: {
        startTime: {
          [Op.gte]: time,
          [Op.lt]: fiveFromTime
        }
      }
    });

    raceInRange = JSON.parse(JSON.stringify(raceInRange));
    if(raceInRange && raceInRange.length){
      const err = 'Cannot create a race with same start time, or a start time within the range of 5 minutes of another.';
      if(res){
        return res.status(400).json({error: err})
      } else {
        console.error(err);
      }
    } else {
      // check if a track id was passed in
      if(typeof track !== 'undefined'){
        if(track && typeof track === 'number'){
          tId = track;
        } else if (track.id && typeof track.id === 'number'){
          tId = track.id;
        };

        // if track id is passed
        if(tId){
          // find the track
          trackId = await Track.findOne({
            where: tId
          })
        }
      }

      // if track still not found    
      if(trackId === null){
        // find a random track to apply
        trackId = await Track.findOne({
          order: sequelize.random()
        });
      }

      if(trackId){
        trackId = trackId.get().id
      }

      const race = {
        startTime: startTime ? startTime : null,
        endTime: endTime ? endTime : null,
        trackId: trackId
      }

      const newRace = await Race.create(race);

      if(racers === true){
        // if racers is true, apply 8 random ones
        const randRacers = await Racer.findAll({
          order: sequelize.random(),
          limit: 8
        });

        await newRace.setRacers(randRacers);
      } else if (racers && racers.length){
        // if provided racers array is larger than 8, cut it down
        if(racers.length > 8){
          racers = racers.splice(0, 8);
        }

        await newRace.setRacers(_shuffle(racers.map(racer => {
          if(typeof racer === 'number'){
            return racer;
          } else if(racer.id && typeof racer === 'number'){
            return racer.id;
          }
        })))
      } else {
        // if no racers added, apply 4 random ones
        const randRacers = await Racer.findAll({
          order: sequelize.random(),
          limit: 4
        });

        await newRace.setRacers(randRacers);
      }

      const result = await Race.findOne({
        where: {
          id: newRace.id
        },
        include: [
          'racers', 'Track'
        ]
      })
      
      if(res){
        return res.status(201).json(result);
      }
    }
  } catch (error) {
    if(res){
      return res.status(500).json({error: error.message})
    } else {
      console.error(error.message);
    }
  }
}

const getAllRaces = async (req, res) => {
  try {
    let payload = {
      include: [ 
        'racers', 'Track'
      ]
    }

    const races = await Race.findAll(payload);
    return res.status(200).json(races);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getSchedule = async (req, res) => {
  try {
    const now = moment().format();
    const endOfDay = moment().endOf('day').format();
    let payload = {
      where: {
        startTime: {
          [Op.between]: [now, endOfDay]
        },
        endTime: null
      },
      include: [ 
        'racers', 'Track'
      ],
      order: [
        ['startTime', 'ASC'],
      ]
    }

    const races = await Race.findAll(payload);
    return res.status(200).json(races);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteEmptyRaces = async () => {
  try {
    const deleted = await Race.destroy({
      where: {
        startTime: {
          [Op.lt]: moment().format()
        },
        endTime: null
      }
    });

    if(deleted){
      console.log('Empty races deleted.')
    } else {
      throw new Error("Empty races not found.");
    }
  } catch (error) {
    console.error(error.message);
  }
}

const deleteOldRaces = async () => {
  try {
    const deleted = await Race.destroy({
      where: {
        startTime: {
          [Op.ne]: null
        },
        endTime: {
          [Op.lt]: moment().subtract(10, 'days').format()
        }
      }
    });
    
    if(deleted){
      console.log('Old races deleted.')
    } else {
      throw new Error("Old races not found.");
    }
  } catch (error) {
    console.error(error.message);
  }
}

const deleteAllRaces = async () => {
  // BE CAREFUL WHEN USING THIS. THIS IS REALLY ONLY MEANT FOR DEVELOPMENT
  try {
    const deleted = await Race.destroy({
      where: {}, 
      truncate: true
    });
    
    if(deleted){
      console.log('All races deleted.')
    } else {
      throw new Error("Issue deleting all races.");
    }
  } catch (error) {
    console.error(error.message);
  }
}

const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const race = await Race.findOne({
      where: { id: id },
      include: [
        'racers', 'Track'
      ]
    });
    if (race) {
      return res.status(200).json(race);
    }
    return res.status(404).send('Race with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
    const [ updated ] = await Race.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedRace = await Race.findOne({ where: { id: id } });
      return res.status(200).json(updatedRace);
    }
    throw new Error('Race not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteRace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Race.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send("Race deleted");
    }
    throw new Error("Race not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const scheduleRaces = async (startDay, everyNMins, numDays) => {
  const hoursInDay = 24;
  const hoursToAdd = numDays * (everyNMins * hoursInDay);

  for(let i = 0; i < hoursToAdd; i++){
    const req = {
      body: {
        startTime: startDay.format()
      }
    }

    if(startDay.hour() === 18){
      // all racers on Boardwalk track
      req.body.racers = true;
      req.body.track = 4;
    }
    
    try {
      // call to create race
      const res = createRace(req);
      startDay.add(10, 'minutes');
      console.log(req.body.startTime);
    } catch (err) {
      console.error(err.message);
    }
  }
}

const createTomorrowRaces = () => {
  let scheduleDay = moment();
  const everyNMins = 10;
  const remainder = everyNMins - (scheduleDay.minute() % everyNMins);
  scheduleDay = scheduleDay.add(remainder, "minutes").seconds(0);
  scheduleRaces(scheduleDay, everyNMins, 1);
}

module.exports = {
  createRace,
  createTomorrowRaces,
  getAllRaces,
  getSchedule,
  getRaceById,
  updateRace,
  deleteRace,
  deleteEmptyRaces,
  deleteOldRaces,
  deleteAllRaces
}