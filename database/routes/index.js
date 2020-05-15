const { Router } = require('express');
const router = Router();
const {Race, RacerRace, Racer, Track, User} = require('../controllers');
const passport = require('passport');

// custom error handling for jwt for admin user
const isAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
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

router.get('/', (req, res) => res.send('Welcome to the Derby API'))

// racers
router.post('/racers', isAdmin, Racer.createRacer);
router.get('/racers', Racer.getAllRacers);
router.get('/racers/:id', Racer.getRacerById);
router.put('/racers/:id', isAdmin, Racer.updateRacer);
router.delete('/racers/:id', isAdmin, Racer.deleteRacer);

// tracks
router.post('/tracks', isAdmin, Track.createTrack);
router.get('/tracks', Track.getAllTracks);
router.get('/tracks/:id', Track.getTrackById);
router.put('/tracks/:id', isAdmin, Track.updateTrack);
router.delete('/tracks/:id', isAdmin, Track.deleteTrack);

// users
router.post('/register', User.register);
router.post('/login', User.login);
router.post('/logout', User.logout);
router.get('/users/:id', isAdmin, User.getUserById);
router.put('/users/:id', isAdmin, User.updateUser);

// races
router.post('/races', isAdmin, Race.createRace);
router.get('/races', Race.getAllRaces);
router.get('/races/:id', Race.getRaceById);
router.put('/races/:id', isAdmin, Race.updateRace);
router.delete('/races/:id', isAdmin, Race.deleteRace);

// racer races (results)
router.get('/results',  RacerRace.getAllRacerRaces);
router.get('/results/:id', RacerRace.getRacerRaceById);

module.exports = router;