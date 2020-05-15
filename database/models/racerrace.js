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
    }
  });

  return RacerRace; 
};