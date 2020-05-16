'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'UserCapabilities',
    [
      {
        id: 1,
        userId: 1,
        capabilityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('UserCapabilities', null, {}),
};
