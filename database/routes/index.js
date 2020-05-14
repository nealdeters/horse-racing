const { Router } = require('express');
const router = Router();
const { racer, track, user, auth} = require('../controllers');;
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.get('/', (req, res) => res.send('Welcome to our API'))

// racers
router.post('/racers', racer.createRacer);
router.get('/racers', racer.getAllRacers);
router.get('/racers/:id', racer.getRacerById);
router.put('/racers/:id', racer.updateRacer);
router.delete('/racers/:id', racer.deleteRacer);

// tracks
router.post('/tracks', track.createTrack);
router.get('/tracks', track.getAllTracks);
router.get('/tracks/:id', track.getTrackById);
router.put('/tracks/:id', track.updateTrack);
router.delete('/tracks/:id', track.deleteTrack);

// user
router.post('/users', user.createUser);
router.get('/users/:id', user.getUserById);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

// auth
router.post('/auth/login', auth.login);
router.post('/auth/logout', auth.logout);

module.exports = router;