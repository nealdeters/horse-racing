'use strict';
module.exports = (sequelize, DataTypes) => {
  const Racer = sequelize.define('Racer', {
    name: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});

  Racer.associate = function(models) {
    Racer.belongsToMany(models.Race, {
      otherKey: 'raceId',
      foreignKey: 'racerId',
      as: 'races',
      through: models.RacerRace,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
  };

  return Racer;
};