const d3 = require('d3-collection')
const _ = require('lodash')
const { latestMonthYearPipeline } = require('../../utils')

const MMIT_COLLECTION = 'payerHistoricalMmitStateLives'
const DRG_COLLECTION = 'payerHistoricalDrgStateLives'

const matchBySlugsQuery = slugs => ([{
  $match: { slug: { $in: slugs } }
}])

const synchronizeLives = async pulseCoreDb => {
  console.log('Synchronizing MMIT and DRG Medical Lives...')

  const mmitCollection = pulseCoreDb.collection(MMIT_COLLECTION)

  const latestMmitData = await mmitCollection
    .aggregate(latestMonthYearPipeline)
    .toArray()

  const mmitSlugToOrgMap = _.mapValues(_.keyBy(latestMmitData, 'slug'), 'organization')

  const startingMmitRowsCount = latestMmitData.length

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
    .rollup(row => row[0]._id) // TODO: But what if there's more than one row here?
    .object(latestMmitData)

  // Get latest month and year from mmit table for mongo query
  const latestMmitMonth = latestMmitData[0].month
  const latestMmitYear = latestMmitData[0].year
  const mmitSlugs = Object.keys(groupMmitBySlugAndId)

  const latestMonthsAndSlugMatchQuery = [
    ...matchBySlugsQuery(mmitSlugs),
    ...latestMonthYearPipeline
  ]

  const latestDrgData = await pulseCoreDb.collection(DRG_COLLECTION)
    .aggregate(latestMonthsAndSlugMatchQuery)

  const iterateDrgCursor = () => new Promise((resolve, reject) => {
    let updatedDocsCount = 0
    let insertionCount = 0

    latestDrgData.forEach(drgRow => {
      const {
        parentSlug,
        slug,
        state,
        stateLong,
        totalMedical,
        commercialMedical,
        medicareMedical,
        macMedical,
        managedMedicaidMedical,
        ffsMedicaidMedical,
        federalOtherMedical,
      } = drgRow

      const timestamp = new Date()

      const medicalLivesFields = {
        totalMedical,
        commercialMedical,
        medicareMedical,
        macMedical,
        managedMedicaidMedical,
        ffsMedicaidMedical,
        federalOtherMedical,
      }

      const mmitOrganization = mmitSlugToOrgMap[slug]
      const mmitRowId = groupMmitBySlugAndId[slug][state]

      // If _id is found in hash map, update the existing document,
      // otherwise insert the new document with the corresponding
      // medical lives
      if (mmitRowId) {
        mmitCollection.updateOne(
          { _id: mmitRowId },
          {
            $set: {
              ...medicalLivesFields,
              updatedOn: timestamp,
            }
          }
        )

        updatedDocsCount++
      } else {
        const newStateData = {
          parentSlug,
          month: latestMmitMonth,
          year: latestMmitYear,
          organization: mmitOrganization,
          state,
          stateLong,
          slug,
          ...medicalLivesFields,
          createdOn: timestamp,
        }

        mmitCollection.insertOne(newStateData)

        insertionCount++
      }
    }, err => {
      if (err) {
        console.error('DRG/MMIT synchronization failed:', err)
        reject(err)
        return
      }

      console.log(`Num of MMIT docs updated: ${updatedDocsCount}`)
      console.log(`Num of untouched MMIT docs (no corresponding DRG slug): ${startingMmitRowsCount - updatedDocsCount}`)
      console.log(`Num of DRG docs copied to MMIT: ${insertionCount}`)
      console.log('DRG/MMIT synchronization successful')
      resolve()
    })
  })

  await iterateDrgCursor()
}

module.exports = synchronizeLives
