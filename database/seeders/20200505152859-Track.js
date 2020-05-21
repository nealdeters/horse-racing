'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Tracks',
    [
      {
        name: 'Park Hills',
        trackColor: 'SeaGreen',
        groundColor: 'SandyBrown',
        railColor: 'Black',
        distance: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sea Grove',
        trackColor: 'MediumSeaGreen',
        groundColor: 'Tan',
        railColor: 'DarkSlateGrey',
        distance: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Moss Course',
        trackColor: 'DarkOliveGreen',
        groundColor: 'OliveDrab',
        railColor: 'White',
        distance: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Boardwalk',
        trackColor: '#4EA24E',
        groundColor: 'BurlyWood',
        railColor: 'LightGrey',
        distance: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tracks', null, {}),
};
