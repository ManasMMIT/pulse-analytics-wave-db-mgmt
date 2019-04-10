const Sequelize = require('sequelize');

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI

const sslConfig = DB_PROD_LOADER_URI
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {};

const sequelize = new Sequelize(DB_PROD_LOADER_URI || DB_LOCAL_LOADER_URI, {
  pool: {
    max: 150,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...sslConfig
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     notNull: true
//   },
//   username: {
//     type: Sequelize.STRING
//   },
// });

// if (process.env.DROP_AND_SEED) {
//   User.sync({ force: true })
//     .then(() => {
//       return User.bulkCreate([
//         {
//           name: 'Bob Smith',
//           username: 'bsmith',
//         },
//       ]);
//     })
//     .catch(console.error);
// }
