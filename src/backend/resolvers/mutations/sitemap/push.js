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

    const [
      usersSitemapsDev,
      usersNodesResourcesDev,
    ] = await Promise.all([
      pulseDevDb.collection('users.sitemaps')
        .find().toArray(),
      pulseDevDb.collection('users.nodes.resources')
        .find().toArray(),
      pulseProdDb.collection('TEMP_users.sitemaps')
        .deleteMany(),
      pulseProdDb.collection('TEMP_users.nodes.resources')
        .deleteMany(),
    ])

    await Promise.all([
      pulseProdDb.collection('TEMP_users.sitemaps')
        .insertMany(usersSitemapsDev),
      pulseProdDb.collection('TEMP_users.nodes.resources')
        .insertMany(usersNodesResourcesDev),
    ])

    await session.withTransaction(async () => {
      // await Promise.all([
      //   pulseProdDb.collection('users.sitemaps')
      //     .renameCollection('random1', { session }),
      //   pulseProdDb.collection('users.nodes.resources')
      //     .renameCollection('random2', { session })
      // ])

      await Promise.all([
        pulseProdDb.collection('TEMP_users.sitemaps')
          .rename('users.sitemaps', { session, dropTarget: true }),
        pulseProdDb.collection('TEMP_users.nodes.resources')
          .rename('users.nodes.resources', { session, dropTarget: true })
      ])
    })

    return 'Sitemap push to prod successful'
  },
}

module.exports = pushOps
