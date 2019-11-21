const _ = require('lodash')

const filterQuery = async (parent, {
  input: { orgTypes, selectedAccount }
}, { pulseRawDb, pulseCoreDb }, info) => {
  const rightSideAccounts = await pulseRawDb.collection('queryTool.phase0')
    .find({ slugType1: { $in: orgTypes } })
    .toArray()

  // make sure right side account's slugs are the only slug
  let slugMatchedRightSideAccounts = _.cloneDeep(rightSideAccounts)
  slugMatchedRightSideAccounts = slugMatchedRightSideAccounts.map(account => {
    account.slug = account.slug1
    account.slugType = account.slugType1

    delete account.slug1
    delete account.slugType1
    return account
  })

  const leftSideAccounts = await pulseRawDb.collection('queryTool.phase0')
    .find({ slugType: { $in: orgTypes } })
    .toArray()

  const combinedAccounts = slugMatchedRightSideAccounts.concat(leftSideAccounts)

  const uniqAccountsBySlug = _.uniqBy(
    combinedAccounts,
    ({ slug, state }) => [slug, state].join(),
  )

  // ! Only necessary while query tool data isn't part of organizations master list
  const masterListAccountMatches = await pulseCoreDb.collection('organizations')
    .find(
      {
        $and: [
          {
            slug: {
              $in: uniqAccountsBySlug.map(({ slug }) => slug)
            }
          },
          { type: { $in: orgTypes } },
        ]
      }
    )
    .toArray()

  const hydratedCombinedAccounts = uniqAccountsBySlug.map(account => {
    const masterListEquivalent = masterListAccountMatches
      .find(({ slug }) => slug === account.slug)
    if (!masterListEquivalent) return false

    return _.merge({}, masterListEquivalent, account)
  })

  let finalCombinedAccounts = _.compact(hydratedCombinedAccounts)

  if (!_.isEmpty(selectedAccount)) {
    const combinedAccountsAgain = rightSideAccounts.concat(leftSideAccounts)
    const selectedAccountConnections = combinedAccountsAgain.map(({
      slug1,
      slugType1,
      slug,
      slugType,
      state,
    }) => {

      if (slug1 === selectedAccount) return { slug, slugType, state }
      if (slug === selectedAccount) return { slug: slug1, slugType: slugType1, state}
      else return false
    })

    const massagedConnections = _.uniqBy(
      _.compact(selectedAccountConnections),
      ({ slug, state }) => [slug, state].join(),
    )

    const hydratedAccountConnections = massagedConnections
      .reduce((acc, connection) => {
        const masterListEquivalent = masterListAccountMatches
          .find(({ slug }) => slug === connection.slug)

        if (masterListEquivalent) acc.push({ ...masterListEquivalent, ...connection})

        return acc
      }, [])

    finalCombinedAccounts = hydratedAccountConnections
  }

  return _.sortBy(finalCombinedAccounts, 'slug')
}

module.exports = filterQuery
