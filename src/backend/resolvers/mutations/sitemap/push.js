const generateSitemaps = require('../../../generate-sitemaps')
const generateUsersPermissions = require('../../../generate-users-permissions')

const pushOps = {
  pushSitemapToDev: async (parent, args, context, info) => {
  const { mongoClient, pulseCoreDb, pulseDevDb } = context
    await generateSitemaps({
      mongoClient,
      pulseCoreDb,
      pulseDevDb,
    })

    await generateUsersPermissions({
      mongoClient,
      pulseCoreDb,
      pulseDevDb,
    })

    return 'Sitemap push to dev successful'
  },
  pushSitemapToProd: async (parent, args, context, info) => {
    const { mongoClient, pulseDevDb, pulseProdDb } = context

    const session = mongoClient.startSession()

    await session.withTransaction(async () => {
      const [
        usersSitemapsDev,
        usersNodesResourcesDev,
      ] = await Promise.all([
        pulseDevDb.collection('users.sitemaps')
          .find({}, { session }).toArray(),
        pulseDevDb.collection('users.nodes.resources')
          .find({}, { session }).toArray(),
        pulseProdDb.collection('users.sitemaps')
          .deleteMany({}, { session }),
        pulseProdDb.collection('users.nodes.resources')
          .deleteMany({}, { session })
      ])

      await Promise.all([
        pulseProdDb.collection('users.sitemaps')
          .insertMany(usersSitemapsDev, { session }),
        pulseProdDb.collection('users.nodes.resources')
          .insertMany(usersNodesResourcesDev, { session })
      ])
    })

    return 'Sitemap push to prod successful'
  },
}

module.exports = pushOps
