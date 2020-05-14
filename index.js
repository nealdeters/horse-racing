const express = require('express');
const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const { sequelize } = require('./database/models');
const routes = require('./database/routes');
require('dotenv').config();

const app = express();

// Init Middleware

// import the passport and passport-jwt strategy
require('./database/middleware/passport');

// init passport
app.use(passport.initialize());

// Passport session setup.
// passport.serializeUser(function(user, done) {
//   console.log("serializing " + user.username);
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   console.log("deserializing " + obj);
//   done(null, obj);
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// request info logger for development
app.use(logger('dev'));

app.use('/api', routes);

// app static assets in production
if(process.env.NODE_ENV === 'production'){
	// set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
	});
});

module.exports = app;