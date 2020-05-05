const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'))

// racers
router.post('/racers', controllers.racer.createRacer);
router.get('/racers', controllers.racer.getAllRacers);
router.get('/racers/:id', controllers.racer.getRacerById);
router.put('/racers/:id', controllers.racer.updateRacer);
router.delete('/racers/:id', controllers.racer.deleteRacer);

// tracks
router.post('/tracks', controllers.track.createTrack);
router.get('/tracks', controllers.track.getAllTracks);
router.get('/tracks/:id', controllers.track.getTrackById);
router.put('/tracks/:id', controllers.track.updateTrack);
router.delete('/tracks/:id', controllers.track.deleteTrack);

module.exports = router;