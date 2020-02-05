const { latestMonthYearPipeline } = require('../../utils')
const _ = require('lodash') 

const appendStructuredLivesField = async ({
  collectionType,
  pulseCoreDb,
  pulseDevDb
}) => {
  const livesFields = [
    { key: 'managedMedicaidMedical', book: 'Managed Medicaid', coverage: 'Medical' },
    { key: 'managedMedicaidPharmacy', book: 'Managed Medicaid', coverage: 'Pharmacy' },
    { key: 'ffsMedicaidMedical', book: 'FFS Medicaid', coverage: 'Medical'},
    { key: 'ffsMedicaidPharmacy', book: 'FFS Medicaid', coverage: 'Pharmacy'},
    { key: 'commercialMedical', book: 'Commercial', coverage: 'Medical'},
    { key: 'commercialPharmacy', book: 'Commercial', coverage: 'Pharmacy'},
    { key: 'medicareMedical', book: 'Medicare', coverage: 'Medical'},
    { key: 'medicarePharmacy', book: 'Medicare', coverage: 'Pharmacy'},
    { key: 'tricareMedical', book: 'Tricare', coverage: 'Medical'},
    { key: 'tricarePharmacy', book: 'Tricare', coverage: 'Pharmacy'},
    { key: 'vaMedical', book: 'VA', coverage: 'Medical'},
    { key: 'vaPharmacy', book: 'VA', coverage: 'Pharmacy'},
    { key: 'macMedical', book: 'MAC', coverage: 'Medical' }
  ]

  const capitalizedCollectionType = _.capitalize(collectionType)
  const nationalLivesTotalCollectionName = `payer${ capitalizedCollectionType }NationalLivesTotals`
  const nationalLivesCollectionName = `payerHistorical${ capitalizedCollectionType }NationalLives`

  const nationalLivesTotal = await pulseCoreDb
    .collection(nationalLivesTotalCollectionName)
    .findOne()

  const nationalLives = await pulseCoreDb
    .collection(nationalLivesCollectionName) 
    .aggregate(
      latestMonthYearPipeline, { allowDiskUse: true }
    )
    .toArray()

  const livesDataWithPercent = nationalLives
    .map(livesObj => {
      const structuredLives = []
      
      livesFields.forEach(({ key, book, coverage }) => {
        if (livesObj[key] !== undefined) {
          const lives = Number(livesObj[key])

          const livesResult = {
            book,
            coverage,
            lives,
            livesPercent: lives / nationalLivesTotal[key]
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
  await pulseDevDb.collection(nationalLivesCollectionName)
    .deleteMany()
    
  await pulseDevDb
    .collection(nationalLivesCollectionName)
    .insertMany(livesDataWithPercent)
  
  console.log(`Inserted ${ livesDataWithPercent.length } Documents to ${ capitalizedCollectionType } lives collection` )
}

const appendPercentLives = async ({
  pulseCoreDb,
  pulseDevDb,
  terminateScript
}) => {
  try {
    console.log('----------Appending structuredLives field to National Lives collections on pulse-dev-----------')
    console.log('Running loader...')

    await appendStructuredLivesField({
      collectionType: 'drg',
      pulseCoreDb,
      pulseDevDb
    })

    await appendStructuredLivesField({
      collectionType: 'mmit',
      pulseCoreDb,
      pulseDevDb
    })
    
  } catch (e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = appendPercentLives
