'use strict';
module.exports = (sequelize, DataTypes) => {
  const Racer = sequelize.define('Racer', {
    name: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  Racer.associate = function(models) {
    // associations can be defined here
  };
  return Racer;
};