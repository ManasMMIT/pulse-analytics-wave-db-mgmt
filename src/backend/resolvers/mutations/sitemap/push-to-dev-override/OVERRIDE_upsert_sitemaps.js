/* eslint-disable no-loop-func */
const upsertUsersSitemaps = require('../upsertUsersSitemaps')

const overrideUpsertSitemaps = async ({ pulseCoreDb, pulseDevDb }) => {
  const CoreUsers = pulseCoreDb.collection('users')
  const users = await CoreUsers.find().toArray()

  await pulseDevDb.collection('users.sitemaps').deleteMany()

  console.log('users.sitemaps collection dropped')

  await upsertUsersSitemaps({
    users,
    pulseCoreDb,
    pulseDevDb,
  })

  console.log('users.sitemaps collection updated')

  return true
}

module.exports = overrideUpsertSitemaps
