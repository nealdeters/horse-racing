const { RacerRace } = require('../models');

const createRacerRace = async (req, res) => {
  try {
    const rr = await RacerRace.create(req.body);
    return res.status(201).json(rr);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getAllRacerRaces = async (req, res) => {
  try {
    const rrs = await RacerRace.findAll();
    return res.status(200).json(rrs);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getRacerRaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const rr = await RacerRace.findOne({
      where: { id: id }
    });
    if (rr) {
      return res.status(200).json(rr);
    }
    return res.status(404).send('RacerRace with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateRacerRace = async (req, res) => {
  try {
    const { id } = req.params;
    const [ updated ] = await RacerRace.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedRacerRace = await RacerRace.findOne({ where: { id: id } });
      return res.status(200).json(updatedRacerRace);
    }
    throw new Error('RacerRace not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteRacerRace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RacerRace.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send("RacerRace deleted");
    }
    throw new Error("RacerRace not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteAllRacerRaces = async () => {
  // BE CAREFUL WHEN USING THIS. THIS IS REALLY ONLY MEANT FOR DEVELOPMENT
  try {
    const deleted = await RacerRace.destroy({
      where: {}, 
      truncate: true
    });
    
    if(deleted){
      console.log('All results deleted.')
    } else {
      throw new Error("Issue deleting all results.");
    }
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  createRacerRace,
  getAllRacerRaces,
  getRacerRaceById,
  updateRacerRace,
  deleteRacerRace,
  deleteAllRacerRaces
}