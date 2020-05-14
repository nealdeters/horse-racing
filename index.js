const express = require('express');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const passport = require('passport');
const { sequelize } = require('./database/models');
const routes = require('./database/routes');
const strategy = require('./database/middleware/passportJWT');
require('dotenv').config();

const app = express();

// Init Middleware

// use the strategy
passport.use(strategy);
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

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
const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
	});
});

module.exports = app;