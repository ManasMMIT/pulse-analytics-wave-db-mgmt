require('dotenv').load()
const LOADER_URI = process.env.LOADER_URI
const MongoClient = require('mongodb').MongoClient
const DB_NAME = 'pulse-dev'

const connectToMongoDb = async () => {
  const dbs = await MongoClient.connect(LOADER_URI, { useNewUrlParser: true })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err)
      process.exit()
    })

  const db = dbs.db(DB_NAME)

  console.log(`-----Connected to ${DB_NAME} DB-----`)
  return db
}

module.exports = connectToMongoDb
