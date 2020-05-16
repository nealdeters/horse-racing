'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCapability = sequelize.define('UserCapability', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Users',
	      key: 'id'
	    }
    },
    capabilityId: {
    	type: DataTypes.INTEGER,
	    references: {
	      model: 'Capabilities',
	      key: 'id'
	    }
    }
  }, {});
  
  return UserCapability;
};