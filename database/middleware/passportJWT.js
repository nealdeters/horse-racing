const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const User = require('../models').User;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: process.env.PASSPORT_JWT_SECRET,
};
const strategy = new JwtStrategy(opts, function(jwt_payload, done) {
  User
    .findByPk(jwt_payload.id)
    .then((user) => { return done(null, user); })
    .catch((error) => { return done(error, false); });
});

module.exports = strategy;