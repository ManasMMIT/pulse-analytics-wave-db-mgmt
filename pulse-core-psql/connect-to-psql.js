require('dotenv').load()
const Sequelize = require('sequelize')

const PSQL_LOADER_URI = process.env.PSQL_LOADER_URI
const isProductionEnv = PSQL_LOADER_URI.includes('amazonaws')

const sslConfig = isProductionEnv
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {}

const connectToPsql = async () => {
  const sequelize = new Sequelize(PSQL_LOADER_URI, sslConfig)

  await sequelize
    .authenticate()
    .then(() => {
      console.log(`-----Connected to PostgreSQL at ${PSQL_LOADER_URI}-----`)
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  return sequelize
}

module.exports = connectToPsql
