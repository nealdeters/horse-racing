'use strict';

module.exports = (sequelize, DataTypes) => {
  const RacerRace = sequelize.define('RacerRace', {
    raceId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Races',
	      key: 'id'
	    }
    },
    racerId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Racers',
	      key: 'id'
	    }
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
      type: DataTypes.STRING(9),
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