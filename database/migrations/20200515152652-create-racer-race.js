'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RacerRaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startTime: {
        type: Sequelize.DATE,
      },
      endTime: {
        type: Sequelize.DATE,
      },
      place: {
        type: Sequelize.INTEGER,
      },
      racerId: {
        type: Sequelize.INTEGER,
      },
      raceId: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.TIME,
      },
      injured: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      lane: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RacerRaces');
  }
};