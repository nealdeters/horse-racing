const { Track } = require('../models');

const createTrack = async (req, res) => {
  try {
    const track = await Track.create(req.body);
    return res.status(201).json(track);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.findAll();
    return res.status(200).json(tracks);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findOne({
      where: { id: id }
    });
    if (track) {
      return res.status(200).json(track);
    }
    return res.status(404).send('Track with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const [ updated ] = await Track.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedTrack = await Track.findOne({ where: { id: id } });
      return res.status(200).json(updatedTrack);
    }
    throw new Error('Track not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Track.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send("Track deleted");
    }
    throw new Error("Track not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack
}