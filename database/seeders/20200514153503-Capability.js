'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Capabilities',
    [
      {
        id: 1,
        name: 'Administrator',
        description: 'Administrator privledges for the entire application.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Gambler',
        description: 'The ability to make bets on races.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Capabilities', null, {}),
};
