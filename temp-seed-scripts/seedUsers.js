const connectToMongoDb = require('../connect-to-mongodb')
const _ = require('lodash')

const seedUsers = async () => {
  const dbs = await connectToMongoDb()

  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')

  console.log('Removing users from pulse-dev.users...')
  await pulseDevDb.collection('users').deleteMany()
  
  console.log ('Getting users from pulse-core.users...')
  const users = await pulseCoreDb.collection('users')
    .find()
    .toArray()

  const seedUsers = users.map(({ _id }) => ({
    _id,
    endUserTerms: {
      agreed: false,
      timestamp: null
    }
  }))

  console.log ('Writing seed users into pulse-dev.users...')
  await pulseDevDb.collection('users').insertMany(seedUsers)

  console.log('Seeding Complete.')
  dbs.close()
}

seedUsers()

