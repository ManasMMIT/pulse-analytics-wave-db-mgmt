/* eslint-disable no-loop-func */
// const _ = require('lodash')
const getCombinedNewSitemaps = require('./getCombinedNewSitemaps')

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
          .find({ 'users._id': user._id }, { session }).toArray()
          .then(userRoles => {
            const userRolesNewSitemaps = userRoles
              .map(({ newSitemap }) => newSitemap)

            let oldSitemap = null
            if (userRoles.length) oldSitemap = userRoles[0].sitemap
      
            const combinedNewSitemap = getCombinedNewSitemaps(userRolesNewSitemaps)
      
            const client = userRoles.length ? userRoles[0].client : null
      
            return DevUsers.updateOne(
              { _id: user._id },
              {
                $set: {
                  sitemap: oldSitemap,
                  newSitemap: combinedNewSitemap,
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
          .find({ 'users._id': user._id }, { session }).toArray()
          .then(userRoles => {
            const userRolesNewSitemaps = userRoles
              .map(({ newSitemap }) => newSitemap)

            const combinedNewSitemap = getCombinedNewSitemaps(userRolesNewSitemaps)

            const client = userRoles.length ? userRoles[0].client : null

            let oldSitemap = null
            if (userRoles.length) oldSitemap = userRoles[0].sitemap

            return DevUsers.insertOne(
              {
                _id: user._id,
                username: user.username,
                client,
                newSitemap: combinedNewSitemap,
                sitemap: oldSitemap,
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

  console.log('New sitemap slice in pulse-dev users.sitemaps collection updated.')

  return true
}

module.exports = generateSitemaps
