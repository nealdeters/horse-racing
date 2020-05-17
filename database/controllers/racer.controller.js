const { Racer, Race } = require('../models');

const createRacer = async (req, res) => {
  try {
    const racer = await Racer.create(req.body);
    return res.status(201).json(racer);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getAllRacers = async (req, res) => {
  try {
    const racers = await Racer.findAll({
      include: [
        {
          model: Race,
          as: 'races'
        }
      ]
    });
    return res.status(200).json(racers);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getRacerById = async (req, res) => {
  try {
    const { id } = req.params;
    const racer = await Racer.findOne({
      where: { id: id }
    });
    if (racer) {
      return res.status(200).json(racer);
    }
    return res.status(404).send('Racer with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateRacer = async (req, res) => {
  try {
    const { id } = req.params;
    const [ updated ] = await Racer.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedRacer = await Racer.findOne({ where: { id: id } });
      return res.status(200).json(updatedRacer);
    }
    throw new Error('Racer not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteRacer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Racer.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send("Racer deleted");
    }
    throw new Error("Racer not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  createRacer,
  getAllRacers,
  getRacerById,
  updateRacer,
  deleteRacer
}