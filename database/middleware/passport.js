/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const strategy = require('./passportJWT');
const { User } = require('../models');
const BCRYPT_SALT_ROUNDS = 12;

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    (req, username, password, done) => {
      try {
        // check that the two provided passwords match
        if(password !== req.body.passwordConfirm){
          return done(null, false, {
            message: 'Passwords do not match.'
          });
        }

        User.findOne({
          where: {
            email: username
          }
        }).then(user => {
          // check if user already exists
          if (user != null) {
            return done(null, false, {
              message: 'Email already in use.'
            });
          }

          // encrypt the password
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            // create user with encrypted password
            User.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: username,
              password: hashedPassword
            }).then(user => {
              return done(null, user);
            });
          });
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    (username, password, done) => {
      try {
        User.findOne({
          where: {
            email: username
          }
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'Invalid email.' });
          }

          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              return done(null, false, { message: 'Passwords do not match.' });
            }
            return done(null, user);
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.use(
  'jwt',
  strategy
);