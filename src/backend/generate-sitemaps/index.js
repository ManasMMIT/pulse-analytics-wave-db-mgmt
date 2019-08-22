/* eslint-disable no-loop-func */
// const _ = require('lodash')
const getCombinedSitemaps = require('./getCombinedSitemaps')

const generateSitemaps = async ({
  mongoClient,
  pulseCoreDb,
  pulseDevDb,
}) => {
  const DevUsers = pulseDevDb.collection('users.sitemaps')
  const CoreRoles = pulseCoreDb.collection('roles')
  const CoreUsers = pulseCoreDb.collection('users')
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    const users = await CoreUsers.find().toArray()

    const promiseArray = []
    for (const user of users) {
      const usersSitemapUser = await DevUsers.findOne({ _id: user._id })

      let promise
      if (usersSitemapUser) {
        promise = CoreRoles
          .find({
            'users._id': user._id },
            { session },
          ).toArray()
          .then(userRoles => {
            const userRolesSitemap = userRoles.map(({ sitemap }) => sitemap)

            const combinedSitemap = getCombinedSitemaps(userRolesSitemap)

            const client = userRoles.length ? userRoles[0].client : null

            return DevUsers.updateOne(
              { _id: user._id },
              {
                $set: {
                  sitemap: combinedSitemap,
                  client,
                  schemaVersion: 'v1.1.0',
                  updatedAt: new Date()
                }
              },
              { session },
            )
          })
      } else {
        promise = CoreRoles
          .find(
            { 'users._id': user._id },
            { session },
          ).toArray()
          .then(userRoles => {
            const userRolesSitemap = userRoles.map(({ sitemap }) => sitemap)

            const combinedSitemap = getCombinedSitemaps(userRolesSitemap)

            const client = userRoles.length ? userRoles[0].client : null

            return DevUsers.insertOne(
              {
                _id: user._id,
                username: user.username,
                client,
                sitemap: combinedSitemap,
                schemaVersion: 'v1.1.0',
                updatedAt: new Date(),
                createdAt: new Date()
              },
              { session },
            )
          })
      }

      promiseArray.push(promise)
    }

    await Promise.all(promiseArray)
  })

  console.log('Sitemap slice in pulse-dev users.sitemaps collection updated.')

  return true
}

module.exports = generateSitemaps
