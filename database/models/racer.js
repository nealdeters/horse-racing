'use strict';
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const Racer = sequelize.define('Racer', {
    name: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});

  Racer.associate = function(models) {
    Racer.belongsToMany(models.Race, {
      otherKey: 'raceId',
      foreignKey: 'racerId',
      as: 'races',
      through: models.RacerRace,
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
  };

  Racer.prototype.getStamina = async (racer) => {
      const start = moment().startOf('day');
      const end = moment().endOf('day');
      let stamina = 100;
      let distanceRunToday = 0;
      let placesToday = 0;

      const todayResults = await sequelize.models.RacerRace.findAll({
        where: {
          startTime: {
            [Op.between]: [start, end]
          },
          endTime: {
            [Op.ne]: null
          },
          racerId: racer.id
        }
      });

      const place  = {};
      todayResults.forEach(result => {
        place[result.raceId] = result.place;
      })

      const todayRaces = await sequelize.models.Race.findAll({
        where: {
          id: todayResults.map(racerrace => {
            return racerrace.raceId;
          })
        },
        include: ['Track']
      });
      
      todayRaces.forEach(race => {
        // length of races decreases stamina
        distanceRunToday += race.Track.distance;
        const trackPlace = place[race.id];
        
        // wins increase stamina
        if(trackPlace){
          if(trackPlace === 1){
            placesToday += race.Track.distance;
          } else if(trackPlace === 2){
            placesToday += (race.Track.distance / 2);
          } else if(trackPlace === 3){
            placesToday += (race.Track.distance / 3);
          } else if(trackPlace === null){
            // if injured, decrease stamina more
            distanceRunToday += 5;
          }
        }
      });

      return ( stamina - ( (distanceRunToday - placesToday) / 8) );
    }

  return Racer;
};