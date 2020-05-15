'use strict';

module.exports = (sequelize, DataTypes) => {
  const Capability = sequelize.define('Capability', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});

  Capability.associate = function(models) {
    Capability.belongsToMany(models.User, {
      otherKey: 'userId',
      foreignKey: 'capabilityId',
      through: models.UserCapability,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
  };

  return Capability;
};