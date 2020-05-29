'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define('Race', {
    startTime: {
      type: DataTypes.DATE,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    trackId: {
      type: DataTypes.INTEGER
    }
  });
  
  Race.associate = function(models) {
    Race.belongsToMany(models.Racer, {
      otherKey: 'racerId',
      foreignKey: 'raceId',
      foreignKeyConstraint: true,
      as: 'racers',
      through: models.RacerRace,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
    Race.belongsTo(models.Track, {
      foreignKey: 'trackId',
      foreignKeyConstraint: true,
      targetKey: 'id',
    });
    // Race.hasMany(models.RacerRace);
  };
  
  return Race; 
};