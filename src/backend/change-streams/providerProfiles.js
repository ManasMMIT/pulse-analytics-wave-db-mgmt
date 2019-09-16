const _ = require('lodash')

const CURRENT_TIME = new Date()

module.exports = client => {
  const core = client.db('pulse-core')

  const providerProfiles = core.collection('providerProfiles')

  const dev = client.db('pulse-dev')

  const providerKeyAccountsList = dev.collection('providerKeyAccountsList')
  const accountsListChangeStream = providerKeyAccountsList.watch()

  const providerPathwaysOverview = dev.collection('providerPathwaysOverview')
  const overviewChangeStream = providerPathwaysOverview.watch()

  accountsListChangeStream.on('change', next => {
    const pathwaysGroupedByProviderSlug = _.groupBy(providerPathwaysOverview, 'slug')

    /* const providers = */ providerKeyAccountsList.map(async ({
      slug,
      organization,
      createdOn,
    }) => {

      const provider = await providerProfiles.findOne({ slug })

      const providerPathways = pathwaysGroupedByProviderSlug[slug]
        .filter(({ pathwaysSlug, pathwaysOrganization }) => {
          return Boolean(pathwaysSlug) && Boolean(pathwaysOrganization) // must have both keys
        })

      const finalPathways = providerPathways.map(pathway => {
        return ({
          slug: pathway.pathwaysSlug,
          organization: pathway.pathwaysOrganization,
        })
      })

      if (provider) {
        await providerProfiles.update(
          { slug },
          {
            $set: {
              slug,
              organization,
              pathways: finalPathways,
              updatedOn: CURRENT_TIME,
            }
          }
        )
      } else {
        await providerProfiles.insertOne({
          slug,
          organization,
          pathways: finalPathways,
          createdOn,
          updatedOn: CURRENT_TIME,
        })
      }
    })
  })

  // 100% dupe code of above for now
  overviewChangeStream.on('change', next => {
    const pathwaysGroupedByProviderSlug = _.groupBy(providerPathwaysOverview, 'slug')

    /* const providers = */ providerKeyAccountsList.map(async ({
      slug,
      organization,
      createdOn,
    }) => {

      const provider = await providerProfiles.findOne({ slug })

      const providerPathways = pathwaysGroupedByProviderSlug[slug]
        .filter(({ pathwaysSlug, pathwaysOrganization }) => {
          return Boolean(pathwaysSlug) && Boolean(pathwaysOrganization) // must have both keys
        })

      const finalPathways = providerPathways.map(pathway => {
        return ({
          slug: pathway.pathwaysSlug,
          organization: pathway.pathwaysOrganization,
        })
      })

      if (provider) {
        await providerProfiles.update(
          { slug },
          {
            $set: {
              slug,
              organization,
              pathways: finalPathways,
              updatedOn: CURRENT_TIME,
            }
          }
        )
      } else {
        await providerProfiles.insertOne({
          slug,
          organization,
          pathways: finalPathways,
          createdOn,
          updatedOn: CURRENT_TIME,
        })
      }
    })
  })
}
