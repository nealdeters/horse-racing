'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Tracks',
    [
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
        name: 'Sea Grove',
        trackColor: 'MediumSeaGreen',
        groundColor: 'Tan',
        railColor: 'DarkSlateGrey',
        distance: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
        name: 'Central Park',
        trackColor: '#4f9151',
        groundColor: '#ffebbb',
        railColor: '#046307',
        distance: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Evergreen Fields',
        trackColor: '#47764c',
        groundColor: '#baada3',
        railColor: 'White',
        distance: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Summer Meadows',
        trackColor: '#6b8f23',
        groundColor: '#ede4b7',
        railColor: '#49582c',
        distance: 35,
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
