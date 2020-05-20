'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define('Race', {
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