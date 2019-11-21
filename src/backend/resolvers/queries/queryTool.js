const _ = require('lodash')

const queryToolAccounts = async (parent, args, { pulseRawDb, pulseCoreDb }, info) => {
  const allAccountConnections = await pulseRawDb.collection('queryTool.phase0')
    .find()
    .toArray()

  const allAccountSlugs = _.flatten(
    allAccountConnections.map(({ slug1, slug }) => [slug1, slug])
  )

  // ! Only necessary while query tool data isn't part of organizations master list
  // ? Extra 6 organizations, when matching?
  const hydratedQueryResult = await pulseCoreDb.collection('organizations')
    .find({ slug: { $in: _.uniq(allAccountSlugs) } })
    .toArray()

  return hydratedQueryResult.map(account => ({
    ...account,
    organization: `${ account.organization } (${ account.type })`,
  }))
}

module.exports = queryToolAccounts
