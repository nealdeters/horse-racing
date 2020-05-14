'use strict';
const bcrypt = require("bcrypt");

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

  User.beforeSave( async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  });

  User.prototype.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
  };

  User.findByEmail = async email => {
    let user = await User.findOne({
      where: { email: email },
    });
  
    return user;
  };

  User.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
  };

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};