const { Router } = require('express');
const router = Router();
const { racer, track, user, auth} = require('../controllers');;
const passport = require("../database/config/passport");
const isAuthenticated = require("../database/config/middleware/isAuthenticated");

router.get('/', (req, res) => res.send('Welcome to our API'))

// racers
router.post('/racers', isAuthenticated, racer.createRacer);
router.get('/racers', racer.getAllRacers);
router.get('/racers/:id', racer.getRacerById);
router.put('/racers/:id', isAuthenticated, racer.updateRacer);
router.delete('/racers/:id', isAuthenticated, racer.deleteRacer);

// tracks
router.post('/tracks', isAuthenticated, track.createTrack);
router.get('/tracks', track.getAllTracks);
router.get('/tracks/:id', track.getTrackById);
router.put('/tracks/:id', isAuthenticated, track.updateTrack);
router.delete('/tracks/:id', isAuthenticated, track.deleteTrack);

// user
router.post('/users', user.createUser);
router.get('/users/:id', isAuthenticated, user.getUserById);
router.put('/users/:id', isAuthenticated, user.updateUser);
router.delete('/users/:id', isAuthenticated, user.deleteUser);

// auth
router.post('/auth/login', passport.authenticate("local"), auth.login);
router.post('/auth/logout', auth.logout);

module.exports = router;