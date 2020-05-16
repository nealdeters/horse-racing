const { sequelize } = require('../models');
const { Race, RacerRace, Racer, Track } = require('../models');

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
        'racers',
        Track
      ]
    })
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getAllRaces = async (req, res) => {
  try {
    const races = await Race.findAll({
      include: [ Racer, Track ]
    });
    return res.status(200).json(races);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const race = await Race.findOne({
      where: { id: id }
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

module.exports = {
  createRace,
  getAllRaces,
  getRaceById,
  updateRace,
  deleteRace
}