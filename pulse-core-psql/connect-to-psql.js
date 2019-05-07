require('dotenv').load()
const Sequelize = require('sequelize')

const PSQL_LOCAL_LOADER_URI = require('./db.config.js')
const PSQL_PROD_LOADER_URI = process.env.PSQL_PROD_LOADER_URI

const sslConfig = PSQL_PROD_LOADER_URI
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {}

const connectToPsql = async () => {
  const sequelize = new Sequelize(PSQL_PROD_LOADER_URI || PSQL_LOCAL_LOADER_URI, sslConfig)

  await sequelize
    .authenticate()
    .then(() => {
      const environment = PSQL_PROD_LOADER_URI ? 'production' : 'local'
      console.log(`-----Connected to PostgreSQL ${environment}-----`)
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  return sequelize
}

module.exports = connectToPsql
