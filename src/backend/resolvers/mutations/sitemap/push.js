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
    const { pulseDevDb, pulseProdDb } = context

    const [
      usersSitemapsDev,
      usersNodesResourcesDev,
    ] = await Promise.all([
      pulseDevDb.collection('users.sitemaps')
        .find().toArray(),
      pulseDevDb.collection('users.nodes.resources')
        .find().toArray(),
      pulseProdDb.collection('users.sitemaps')
        .deleteMany(),
      pulseProdDb.collection('users.nodes.resources')
        .deleteMany(),
    ])

    console.log('latest DEV sitemaps and nodes.resources has been READ')
    console.log('old PROD sitemaps and nodes.resources DELETED')

    await Promise.all([
      pulseProdDb.collection('users.sitemaps')
        .insertMany(usersSitemapsDev),
      pulseProdDb.collection('users.nodes.resources')
        .insertMany(usersNodesResourcesDev)
    ])

    console.log('new PROD sitemaps and nodes.resources INSERTED')

    return 'Sitemap push to prod successful'
  },
}

module.exports = pushOps
