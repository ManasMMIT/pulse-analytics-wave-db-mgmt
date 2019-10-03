const _ = require('lodash')

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

const consolidateAlertSheets = async ({ pulseDevDb, mongoConnection }) => {
  console.log('Beginning to aggregate alerts...')
  // we use the aggregation pipeline to filter pathwaysHistoricalProviderAdoption
  // by the most recently uploaded documents e.g. (year: 2019, quarter: 2)
  const [
    pathwaysInfluencers,
    providers,
    protocols,
    payerLives,
    pathwaysHistoricalProviderAdoption,
  ] = await Promise.all([
    pulseDevDb
      .collection('pathwaysInfluencers')
      .find({ alertDate: { $exists: true } })
      .toArray(),
    pulseDevDb
      .collection('providers')
      .find({ alertDate: { $exists: true } })
      .toArray(),
    pulseDevDb
      .collection('protocols')
      .find({ alertDate: { $exists: true } })
      .toArray(),
    pulseDevDb
      .collection('payerLives')
      .find({ alertDate: { $exists: true } })
      .toArray(),
    pulseDevDb
      .collection('pathwaysHistoricalProviderAdoption')
      .aggregate(PROVIDER_AGG_PIPELINE)
      .toArray(),
  ])

  const historicalProviderAdoptionBySlug = _.keyBy(
    pathwaysHistoricalProviderAdoption,
    'slug'
  )

  const aggregatedCollections = [
    { data: pathwaysInfluencers, type: 'Influencer', permission: ['account', 'indication'] },
    { data: providers, type: 'Provider', permission: ['account'] },
    { data: protocols, type: 'Positioning', permission: ['account', 'indication', 'regimen'] },
    { data: payerLives, type: 'Payer', permission: ['account'] },
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

  const consolidatedAlerts = aggregatedCollections.reduce((acc, collection) => {
      const { data, type, permission } = collection

      data.forEach(item => {
        const { slug } = item

        const providerAdoptionData = historicalProviderAdoptionBySlug[slug]

        const { totalOncologists, oncologists } = providerAdoptionData
        const oncologistPercent = oncologists / totalOncologists

        const additionalFields = {
          superAlertType: type,
          oncologistPercent,
          permission,
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

  const session = mongoConnection.startSession()

  try {
    await session.withTransaction(async () => {
      console.log(`Deleting all existing data in "alerts" collection...`)
      await pulseDevDb.collection('alerts').deleteMany()

      console.log(`Inserting new data into "alerts" collection...`)
      await pulseDevDb
        .collection('alerts')
        .insertMany(consolidatedAlerts, { ordered: false })

      console.log('"alerts" collection has been successfully updated!')
      console.log('-------- step 1 completed --------')
    })
  } catch (e){
    console.log('Failed to update alerts collection in mongoDB')
    console.log(e)
  }
}

module.exports = consolidateAlertSheets