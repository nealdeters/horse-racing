const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const { sequelize, Sequelize } = require('./database/models');
const routes = require('./database/routes');
const cron = require('node-cron');
const moment = require('moment');
const path = require('path');
const { racerCronJob } = require('./moveRacer');;

require('dotenv').config();

const app = require('express')();
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
	racerCronJob(io);

	io.on('disconnect', (socket) => {
		console.log(`User ${socket.id} disconnected.`);
	});
});

// cron job every minute
cron.schedule('* * * * *', () => {
	racerCronJob(io);
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