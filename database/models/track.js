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
    // associations can be defined here
  };
  return Track;
};