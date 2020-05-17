'use strict';

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
    },
    endTime: {
      type: DataTypes.DATE,
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