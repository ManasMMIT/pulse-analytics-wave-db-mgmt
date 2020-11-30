require('dotenv').config()

let LOADER_URI = ''
const {
  MONGO_USERNAME,
  MONGO_PASSWORD
} = process.env

if (process.env.DB_CLUSTER_ENV === 'production') {
  LOADER_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@wave-shard-00-00-ik4h2.mongodb.net:27017,wave-shard-00-01-ik4h2.mongodb.net:27017,wave-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-shard-0&authSource=admin`
} else if (process.env.DB_CLUSTER_ENV === 'staging') {
  LOADER_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-staging-shard-0&authSource=admin`
} else if (process.env.DB_CLUSTER_ENV === 'local') {
  LOADER_URI = 'mongodb://localhost:27017'
}

const MongoClient = require('mongodb').MongoClient

const connectToMongoDb = async () => {
  const mongoConnection = await MongoClient.connect(LOADER_URI, { useUnifiedTopology: true })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err)
      process.exit()
    })

  console.log(`Connected to MongoDB cluster: ${process.env.DB_CLUSTER_ENV}`)

  return mongoConnection
}

module.exports = connectToMongoDb
