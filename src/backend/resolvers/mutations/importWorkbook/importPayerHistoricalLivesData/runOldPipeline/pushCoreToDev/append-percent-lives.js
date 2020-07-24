const latestMonthYearPipeline = require('../latest-month-year-agg-pipeline')
const _ = require('lodash')

const appendStructuredLivesField = async ({
  collectionType,
  pulseCoreDb,
  pulseDevDb,
  session,
}) => {
  const livesFields = [
    {
      key: 'managedMedicaidMedical',
      book: 'Managed Medicaid',
      coverage: 'Medical',
    },
    {
      key: 'managedMedicaidPharmacy',
      book: 'Managed Medicaid',
      coverage: 'Pharmacy',
    },
    { key: 'ffsMedicaidMedical', book: 'FFS Medicaid', coverage: 'Medical' },
    { key: 'ffsMedicaidPharmacy', book: 'FFS Medicaid', coverage: 'Pharmacy' },
    { key: 'commercialMedical', book: 'Commercial', coverage: 'Medical' },
    { key: 'commercialPharmacy', book: 'Commercial', coverage: 'Pharmacy' },
    { key: 'medicareMedical', book: 'Medicare', coverage: 'Medical' },
    { key: 'medicarePharmacy', book: 'Medicare', coverage: 'Pharmacy' },
    { key: 'federalOtherMedical', book: 'Federal/Other', coverage: 'Medical' },
    {
      key: 'federalOtherPharmacy',
      book: 'Federal/Other',
      coverage: 'Pharmacy',
    },
    { key: 'macMedical', book: 'MAC', coverage: 'Medical' },
  ]

  const capitalizedCollectionType = _.capitalize(collectionType)
  const nationalLivesTotalCollectionName = `payer${capitalizedCollectionType}NationalLivesTotals`
  const nationalLivesCollectionName = `payerHistorical${capitalizedCollectionType}NationalLives`

  const nationalLivesTotal = await pulseCoreDb
    .collection(nationalLivesTotalCollectionName)
    .findOne()

  const nationalLives = await pulseCoreDb
    .collection(nationalLivesCollectionName)
    .aggregate(latestMonthYearPipeline, { allowDiskUse: true })
    .toArray()

  const livesDataWithPercent = nationalLives.map((livesObj) => {
    const structuredLives = []

    livesFields.forEach(({ key, book, coverage }) => {
      if (livesObj[key] !== undefined) {
        const lives = Number(livesObj[key]) || 0

        const livesResult = {
          book,
          coverage,
          lives,
          livesPercent: lives / nationalLivesTotal[key],
        }

        structuredLives.push(livesResult)
      }
    })

    return {
      ...livesObj,
      structuredLives,
    }
  })

  // Insert data with new field to pulse-dev
  await pulseDevDb
    .collection(nationalLivesCollectionName)
    .deleteMany({}, { session })

  await pulseDevDb
    .collection(nationalLivesCollectionName)
    .insertMany(livesDataWithPercent, { session })

  console.log(
    `Inserted ${livesDataWithPercent.length} Documents to ${capitalizedCollectionType} lives collection`
  )
}

const appendPercentLives = async ({ pulseCoreDb, pulseDevDb, session }) => {
  console.log(
    '----------Appending structuredLives field to National Lives collections on pulse-dev-----------'
  )

  await appendStructuredLivesField({
    collectionType: 'drg',
    pulseCoreDb,
    pulseDevDb,
    session,
  })

  await appendStructuredLivesField({
    collectionType: 'mmit',
    pulseCoreDb,
    pulseDevDb,
    session,
  })
}

module.exports = appendPercentLives
