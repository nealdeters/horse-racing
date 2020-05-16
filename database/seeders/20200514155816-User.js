'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        id: 1,
        firstName: 'Neal',
        lastName: 'Deters',
        email: 'nealdeters@gmail.com',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
