const d3 = require('d3-collection')
const connectToMongoDb = require('../connect-to-mongodb')
const latestMonthYearDataQuery = require('./aggregation-pipeline')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../utils')

const MMIT_COLLECTION = 'payerHistoricalMmitStateLives'
const DRG_COLLECTION = 'payerHistoricalDrgStateLives'

const matchBySlugsQuery = slugs => ([{
  $match: { slug: { $in: slugs } }
}])

const synchronizeLives = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  console.log('-----------DRG MMIT Medical Lives Synchronization-----------')

  console.log('syncing collections...')

  await verifyCollectionExists(MMIT_COLLECTION, pulseDevDb, mongoConnection)

  const latestMmitData = await pulseDevDb.collection(MMIT_COLLECTION)
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

  const latestDrgData = await pulseDevDb.collection(DRG_COLLECTION)
    .aggregate(latestMonthsAndSlugMatchQuery)

  const mmitCollection = pulseDevDb.collection(MMIT_COLLECTION)

  latestDrgData.forEach(drgRow => {
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
      vaMedical,
    } = drgRow

    const timestamp = new Date()

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

    // If _id is found in hash map, update the existing document,
    // otherwise insert the new document with the corrresponding
    // medical lives
    if (mmitRowId) {
      mmitCollection.updateOne(
        { _id: mmitRowId },
        { $set: {
            ...medicalLivesFields,
            updatedOn: timestamp,
          }
        }
      ).then(result => {
        console.log(`Updated the following id: ${mmitRowId}`)
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
        ...medicalLivesFields,
        createdOn: timestamp,
      }

      mmitCollection.insertOne(newStateData)
        .then(result => {
          console.log(`Inserted the following id: ${result.insertedId}`)
        })
    }
  }, async err => {
    console.log('Script finished executing')
    await terminateScript(err)
  })
}

synchronizeLives()
