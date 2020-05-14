'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      validate: {
        isEmail: true,
        len: [1,255]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, Infinity],
          msg: 'Password must be a minimum of 8 characters.'
        }
      }
    }
  });
  
  User.associate = function(models) {
    User.belongsToMany(models.Capability, {
      uniqueKey: 'capabilityId',
      foreignKey: 'userId',
      through: models.UserCapability
    });
  };

  // User.sync()
  // .then(() => console.log('User table created successfully'))
  // .catch(err => console.log('oooh, did you enter wrong database credentials?'));

  return User;
};