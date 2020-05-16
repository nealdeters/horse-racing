'use strict';
module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    name: DataTypes.STRING,
    trackColor: DataTypes.STRING,
    groundColor: DataTypes.STRING,
    railColor: DataTypes.STRING,
    distance: DataTypes.INTEGER
  }, {});
  Track.associate = function(models) {
    Track.hasMany(models.Race, {
      foreignKey: 'trackId', 
      sourceKey: 'id'
    });
  };
  return Track;
};