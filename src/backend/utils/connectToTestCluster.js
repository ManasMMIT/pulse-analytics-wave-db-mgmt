require('dotenv').config()

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env

const LOADER_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-staging-shard-0&authSource=admin`

const MongoClient = require('mongodb').MongoClient

const connectToTestCluster = async () => {
  const mongoConnection = await MongoClient.connect(LOADER_URI, {
    useUnifiedTopology: true,
  }).catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit()
  })

  console.log(`Connected to MongoDB staging cluster for testing`)

  return mongoConnection
}

module.exports = connectToTestCluster
