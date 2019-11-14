const _ = require('lodash')

const getFilteredData = require('../filter-user-data-utils/getFilteredData')

const ALERT_COLLECTIONS = [
  'pathwaysKeyEvents',
  'pathwaysInfluencers',
  'providers',
  'protocols',
  'payerLives',
  'pathwaysHistoricalProviderAdoption',
]

const PROVIDER_AGG_PIPELINE = [
  {
    $group: {
      _id: {
        year: '$year',
        quarter: '$quarter',
      },
      data: { $push: '$$ROOT' },
    },
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.quarter': -1,
    },
  },
  { $limit: 1 },
  { $unwind: '$data' },
  {
    $replaceRoot: {
      newRoot: '$data',
    },
  },
]

const getUserPathwaysAlerts = async ({
  pulseDevDb,
  subscriptionId,
  userNodesResources,
  date,
}) => {
  // ! NOTE: Looks like getAggPipeline.js later suffers from special-casing
  // ! due to not wanting break up this map function below to special case for
  // ! pathwaysHistoricalProviderAdoption vs the other collections.
  // ! See related note in filter-user-data-utils/getAggPipeline.js
  const filteredCollectionPromises = ALERT_COLLECTIONS
    .map(collectionName => (
      getFilteredData({
        db: pulseDevDb,
        collectionName,
        subscriptionId,
        userNodesResources,
        date,
      })
    ))

  // we use the aggregation pipeline to filter pathwaysHistoricalProviderAdoption
  // by the most recently uploaded documents e.g. (year: 2019, quarter: 2)
  const [
    pathwaysKeyEvents,
    pathwaysInfluencers,
    providers,
    protocols,
    payerLives,
    pathwaysHistoricalProviderAdoption,
  ] = await Promise.all(filteredCollectionPromises)

  const historicalProviderAdoptionBySlug = _.keyBy(
    pathwaysHistoricalProviderAdoption,
    'slug'
  )

  const aggregatedCollections = [
    { data: pathwaysKeyEvents, type: 'Key Event'},
    { data: pathwaysInfluencers, type: 'Influencer'},
    { data: providers, type: 'Provider'},
    { data: protocols, type: 'Positioning'},
    { data: payerLives, type: 'Payer'},
  ]

  // collect all of the unique slugs present in the three collection
  const collectionSlugs = aggregatedCollections.reduce((acc, { data }) => {
    data.forEach(({ slug }) => acc.add(slug))
    return acc
  }, new Set())

  // create a list of differences between the unique slugs and the slugs present in
  // the LATEST historicalProviderAdoption data
  const missingSlugs = _.difference(
    Array.from(collectionSlugs),
    Object.keys(historicalProviderAdoptionBySlug)
  )

  // if there are any slugs missing we trigger the fallback
  if (!_.isEmpty(missingSlugs)) await providerAdoptionFallback(missingSlugs)

  const userPathwaysAlerts = aggregatedCollections.reduce((acc, collection) => {
    const { data, type } = collection

    data.forEach(item => {
      const { slug } = item

      const providerAdoptionData = historicalProviderAdoptionBySlug[slug]

      const { totalOncologists, oncologists } = providerAdoptionData
      const oncologistPercent = oncologists / totalOncologists

      const additionalFields = {
        superAlertType: type,
        oncologistPercent,
      }

      acc.push({ ...item, ...additionalFields })
    })

    return acc
  }, [])

  // the fallback finds the most recent document e.g. (year: 2019, quarter: 1)
  // related to that slug so we can fill in the oncologist data
  async function providerAdoptionFallback(missingSlugs) {
    for (const slug of missingSlugs) {
      console.log(
        `Using oncologist fallback for ${slug} - please upload latest data for ${slug} on 'pathwaysHistoricalProviderAdoption'`
      )
      const matchAggPipeline = { $match: { slug } }
      const clonedPipeline = _.cloneDeep(PROVIDER_AGG_PIPELINE)
      clonedPipeline.unshift(matchAggPipeline)

      const fallbackData = await pulseDevDb
        .collection('pathwaysHistoricalProviderAdoption')
        .aggregate(clonedPipeline)
        .toArray()

      historicalProviderAdoptionBySlug[slug] = fallbackData[0]
    }
  }

  return userPathwaysAlerts
}

module.exports = getUserPathwaysAlerts
