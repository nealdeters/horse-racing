const express = require('express');
const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const { sequelize, Sequelize, Racer } = require('./database/models');
const routes = require('./database/routes');
const cron = require('node-cron');
const path = require('path');
const { Race, RacerRace } = require('./database/controllers');
const moment = require('moment-timezone');

// set server timezone to chicago
moment().tz("America/Chicago").format();

require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Init Middleware

// import the passport and passport-jwt strategy
require('./database/middleware/passport');

// init passport
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// request info logger for development
app.use(logger('dev'));

app.use('/api', routes);

// web socket connection
io.on('connection', (socket) => {
	console.log(`User ${socket.id} connected.`);

	socket.on('disconnect', (reason) => {
		console.log(`User disconnected.`);
	});
});

// cron job every second
// cron.schedule('*/1 * * * * *', () => {
// 	Racer.move(io);
// });

const moveRacers = () => {
	Racer.move(io);

	setTimeout(() => {
		moveRacers();
	}, 500)
}

moveRacers();

// Race.deleteOldRaces();
// RacerRace.deleteOldRacerRaces();
// Race.deleteAllRaces();
// Race.createTomorrowRaces();

// every day at 3am schedule races
cron.schedule('0 3 * * *', () => {
	Race.createTomorrowRaces();
});

// every day at 3am delete empty races
cron.schedule('0 3 * * *', () => {
	Race.deleteEmptyRaces();
});

// every day at 3am delete races that are 3 days old
cron.schedule('0 3 * * *', () => {
	Race.deleteOldRaces();
	RacerRace.deleteOldRacerRaces();
});

// app static assets in production
if(process.env.NODE_ENV === 'production'){
	// set static folder
	// app.use(express.static('client/build'));
	app.use(express.static(path.join(__dirname, 'client/build')));

	app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
	server.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
	});
});

module.exports = app;