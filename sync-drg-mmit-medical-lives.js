const d3 = require('d3-collection')
const connectToMongoDb = require('./connect-to-mongodb')
const { verifyCollectionExists } = require('./utils')

const MMIT_COLLECTION = 'payerHistoricalMmitStateLives'
const DRG_COLLECTION = 'payerHistoricalDrgStateLives'

const latestMonthYearDataQuery = [
  {
    $group: {
      _id: {
        year: '$year',
        month: '$month',
      },
      data: { $push: '$$ROOT' }
    }
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.month': -1
    }
  },
  {
    $limit: 1
  },
  {
    $unwind: '$data'
  },
  {
    $replaceRoot: { newRoot: '$data' }
  }
]

const matchBySlugsQuery = slugs => ([{
  $match: { slug: { $in: slugs } }
}])

const synchronizeLives = async () => {
  const mongoConnection = await connectToMongoDb()
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  console.log('-----------DRG MMIT Medical Lives Synchronization-----------')

  console.log('syncing collections...')

  await verifyCollectionExists(MMIT_COLLECTION, pulseDevDb, mongoConnection)

  const latestMmitData = await db.collection(MMIT_COLLECTION)
    .aggregate(latestMonthYearDataQuery)
    .toArray()

  /* Prepare configuration _id map in the shape of:
    * {
    *    'aetna': {
    *       NY: _id,
    *       CA: _id
    *       ...
    *     },
    *     ...
    *  }
    */
  const groupMmitBySlugAndId = d3.nest()
    .key(row => row.slug)
    .key(row => row.state)
    .rollup(row => row[0]._id)
    .object(latestMmitData)

  // Get latest month and year from mmit table for mongo query
  const latestMmitMonth = latestMmitData[0].month
  const latestMmitYear = latestMmitData[0].year
  const mmitSlugs = Object.keys(groupMmitBySlugAndId)

  const latestMonthsAndSlugMatchQuery = [
    ...matchBySlugsQuery(mmitSlugs),
    ...latestMonthYearDataQuery
  ]

  const latestDrgData = await db.collection(DRG_COLLECTION)
    .aggregate(latestMonthsAndSlugMatchQuery)

  const mmitCollection = db.collection(MMIT_COLLECTION)

  latestDrgData.forEach(async (drgRow) => {
    const {
      parentSlug,
      slug,
      state,
      stateLong,
      organization,
      totalMedical,
      commercialMedical,
      medicareMedical,
      macMedical,
      managedMedicaidMedical,
      ffsMedicaidMedical,
      tricareMedical,
      vaMedical
    } = drgRow

    const medicalLivesFields = {
      totalMedical,
      commercialMedical,
      medicareMedical,
      macMedical,
      managedMedicaidMedical,
      ffsMedicaidMedical,
      tricareMedical,
      vaMedical
    }

    const mmitRowId = groupMmitBySlugAndId[slug][state]

    // If Id is found in hash map, update the existing document,
    // otherwise insert the new document with the corrresponding
    // medical lives
    if (mmitRowId) {
      mmitCollection.update(
        { _id: mmitRowId },
        { $set: medicalLivesFields }
      ).then(result => {
        console.log(`Updated the following id: ${mmitRowId}`)
        console.log(result)
      })
    } else {
      const newStateData = {
        parentSlug,
        month: latestMmitMonth,
        year: latestMmitYear,
        organization,
        state,
        stateLong,
        slug,
        ...medicalLivesFields
      }

      mmitCollection.insert(newStateData)
        .then(result => {
          console.log(`Inserted the following id: ${result._id}`)
        })
    }
  }, (err) => {
    if (err) console.log(err)
    console.log('Finished Syncing')
    process.exit()
  })
}

synchronizeLives()
