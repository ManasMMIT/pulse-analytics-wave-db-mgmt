const generateSitemaps = require('../../../generate-sitemaps')
const generateUsersPermissions = require('../../../generate-users-permissions')

const pushOps = {
  pushSitemapToDev: async (parent, args, context, info) => {
  const { mongoClient, pulseCoreDb, pulseDevDb } = context

    await Promise.all(
      [
        generateSitemaps({
          mongoClient,
          pulseCoreDb,
          pulseDevDb,
        }),
        generateUsersPermissions({
          mongoClient,
          pulseCoreDb,
          pulseDevDb,
        })
      ]
    )

    return 'Sitemap push to dev successful'
  },
  pushSitemapToProd: async (parent, args, context, info) => {
    const { mongoClient, pulseDevDb, pulseProdDb } = context

    const session = mongoClient.startSession()

    await session.withTransaction(async () => {
      const usersSitemapsDev = await pulseDevDb.collection('users.sitemaps')
        .find({}, { session }).toArray()

      await pulseProdDb.collection('users.sitemaps')
        .deleteMany({}, { session })

      await pulseProdDb.collection('users.sitemaps')
        .insertMany(usersSitemapsDev, { session })
    })

    return 'Sitemap push to prod successful'
  },
}

module.exports = pushOps
