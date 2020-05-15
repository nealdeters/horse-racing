const express = require('express');
const socketIO = require('socket.io')
const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const { sequelize, Sequelize } = require('./database/models');
const routes = require('./database/routes');
const cron = require('node-cron');
const moment = require('moment');
const http = require('http');
const { racerCronJob } = require('./moveRacer');;

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// const expressWs = require('express-ws')(app);

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
	console.log('user connected')
	// console.log(moment().format('mm:ss.SSS'))

	socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

let counter = 0;

const raceProgress = () => {
	io.emit('raceProgress', counter++);

	setTimeout(() => {
		raceProgress();
	}, 1000);
}

// cron job every minute
cron.schedule('* * * * *', () => {
	console.log('CRON JOB')
	racerCronJob();
});

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


	server.listen(3001, () => console.log(`Listening on port 3001`))
});

module.exports = app;