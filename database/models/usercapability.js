'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCapability = sequelize.define('UserCapability', {
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