const { Router } = require('express');
const router = Router();
const { racer, track, user} = require('../controllers');
const { User } = require('../models');
const passport = require('passport');

// custom error handling for jwt
const isAuthenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send(info.message);
    } else if (user.Capabilities.length) {
      const isAdmin = user.Capabilities.find(capability => {
      	return capability.name === 'Administrator';
      });

      if(isAdmin){
      	// callback
      	next()
      } else {
      	res.status(401).send({
      		msg: 'User does not have the required capablities.'
      	});
      }
    } else {
      res.status(403).send({
      	msg: 'username and jwt token do not match'
      });
    }
  })(req, res, next);
}

router.get('/', (req, res) => res.send('Welcome to our API'))

// racers
router.post('/racers', isAuthenticatedAdmin, racer.createRacer);
router.get('/racers', racer.getAllRacers);
router.get('/racers/:id', racer.getRacerById);
router.put('/racers/:id', isAuthenticatedAdmin, racer.updateRacer);
router.delete('/racers/:id', isAuthenticatedAdmin, racer.deleteRacer);

// tracks
router.post('/tracks', isAuthenticatedAdmin, track.createTrack);
router.get('/tracks', track.getAllTracks);
router.get('/tracks/:id', track.getTrackById);
router.put('/tracks/:id', isAuthenticatedAdmin, track.updateTrack);
router.delete('/tracks/:id', isAuthenticatedAdmin, track.deleteTrack);

// user
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/users/:id', isAuthenticatedAdmin, user.getUserById);
router.put('/users/:id', isAuthenticatedAdmin, user.updateUser);

module.exports = router;