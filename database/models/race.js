'use strict';

module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define('Race', {
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
    trackId: {
      type: DataTypes.INTEGER
    }
  });
  
  Race.associate = function(models) {
    Race.belongsToMany(models.Racer, {
      otherKey: 'racerId',
      foreignKey: 'raceId',
      as: 'racers',
      through: models.RacerRace,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
    Race.belongsTo(models.Track, {
      foreignKey: 'trackId',
      targetKey: 'id'
    });
  };

  return Race; 
};