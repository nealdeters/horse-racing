'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const RacerRace = sequelize.define('RacerRace', {
    raceId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Races',
	      key: 'id'
	    },
      onDelete: 'cascade'
    },
    racerId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Racers',
	      key: 'id'
	    },
      onDelete: 'cascade'
    },
    startTime: {
      type: DataTypes.DATE,
      // get() {
      //   const dateText = this.getDataValue('startTime');
      //   return moment(dateText).format('YYYY-MM-DD HH:mm:ss');
      // }
    },
    endTime: {
      type: DataTypes.DATE,
      // get() {
      //   const dateText = this.getDataValue('endTime');
      //   return moment(dateText).format('YYYY-MM-DD HH:mm:ss');
      // }
    },
    place: {
      type: DataTypes.INTEGER,
    },
    duration: {
      type: DataTypes.TIME,
    },
    injured: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    lane: {
      type: DataTypes.INTEGER,
    }
  });

  return RacerRace; 
};