require('dotenv').config()

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false, //for reading from database,
      dateStrings: true,
      typeCast(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
            return field.string();
        }
        return next();
      }
    },
    timezone: 'America/Chicago', //for writing to database
    logging: false
  },
  // test: {
  //   url: process.env.TEST_DATABASE_URL,
  //   dialect: 'postgres',
  // },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false, //for reading from database,
      dateStrings: true,
      typeCast(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
            return field.string();
        }
        return next();
      }
    },
    timezone: 'America/Chicago' //for writing to database
  },
}