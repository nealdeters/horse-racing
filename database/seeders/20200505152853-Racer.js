'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Racers',
      [
        {
          name: 'Spiral Ham',
          primaryColor: 'DeepPink',
          secondaryColor: 'Black',
          type: 'Middle',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Carmella\'s Dream',
          primaryColor: 'Red',
          secondaryColor: 'Black',
          type: 'Starter',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Kenny',
          primaryColor: 'Whitesmoke',
          secondaryColor: 'Black',
          type: 'Starter',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Frederico',
          primaryColor: 'Black',
          secondaryColor: 'White',
          type: 'Finisher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Papa Smurf',
          primaryColor: 'DodgerBlue',
          secondaryColor: 'White',
          type: 'Starter',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lucky Clover',
          primaryColor: 'Lime',
          secondaryColor: 'Black',
          type: 'Starter',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Solar',
          primaryColor: 'Gold',
          secondaryColor: 'Black',
          type: 'Finisher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Nemo',
          primaryColor: 'DarkOrange',
          secondaryColor: 'Black',
          type: 'Finisher',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {},
    ),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Racers', null, {}),
};
