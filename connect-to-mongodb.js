require('dotenv').config()
const LOADER_URI = process.env.LOADER_URI
const MongoClient = require('mongodb').MongoClient

const connectToMongoDb = async () => {
  const mongoConnection = await MongoClient.connect(LOADER_URI, { useNewUrlParser: true })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err)
      process.exit()
    })

  console.log(`-----Connected to ${LOADER_URI}-----`)
  return mongoConnection
}

module.exports = connectToMongoDb
