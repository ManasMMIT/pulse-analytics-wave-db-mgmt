const _ = require('lodash')
const d3 = require('d3-collection')
const connectToMongoDb = require('../connect-to-mongodb')
const getLatestMonthYearProjectPipeline = require('./importProjectBasedData/latest-month-year-project')
const { getScriptTerminator } = require('../utils')

const getLivesKey = (book, coverage) => {
  if (book.includes('Medicare')) {
    return _.camelCase(`medicare ${coverage}`)
  }
  return _.camelCase(`${book} ${coverage}`)
}

const getTreatmentPlanKey = d => (
  `${d.indication}|${d.population}|${d.line}}|${d.regimen}|${getLivesKey(d.book, d.coverage)}`
)

const consolidatePayerData = async (...args) => {
  let pulseDevDb
  let pulseCoreDb
  let terminateScript

  if (_.isEmpty(args)) {
    const mongoConnection = await connectToMongoDb()
    terminateScript = getScriptTerminator(mongoConnection)
    pulseDevDb = await mongoConnection.db('pulse-dev')
    pulseCoreDb = await mongoConnection.db('pulse-core')
  } else {
    [pulseDevDb, pulseCoreDb, terminateScript] = args
  }

  try {
    // Entry point for joining data is latest month/year/project qoa data
    let combinedPayerData = await pulseDevDb.collection('payerHistoricalQualityAccess')
      .aggregate(getLatestMonthYearProjectPipeline(1), { allowDiskUse: true })
      .toArray()

    // Join access objects from master access list in pulse-core
    let qualityAccessScores = await pulseCoreDb.collection('qualityAccessScores').find().toArray()
    qualityAccessScores = _.keyBy(qualityAccessScores, 'access')

    // warning: order of destructuring matters here! otherwise obj's _id is overwritten, resulting in dup keys
    combinedPayerData = combinedPayerData.map(obj => ({ ...qualityAccessScores[obj.access], ...obj }))

    // Join latest month/year/project historical policy links
    const payerHistoricalPolicyLinks = await pulseDevDb.collection('payerHistoricalPolicyLinks')
      .aggregate(getLatestMonthYearProjectPipeline(1), { allowDiskUse: true })
      .toArray()

    const policyLinksHash = _.keyBy(
      payerHistoricalPolicyLinks,
      d => `${d.slug} ${d.regimen} ${d.book} ${d.coverage}`
    )

    combinedPayerData.forEach(obj => {
      const { slug, regimen, book, coverage } = obj
        const comboKey = `${slug} ${regimen} ${book} ${coverage}`
        if (policyLinksHash[comboKey]) {
          obj.policyLink = policyLinksHash[comboKey].link
        }
    })

    // Join latest month/year/project historical additional criteria
    const payerHistoricalAdditionalCriteria = await pulseDevDb.collection('payerHistoricalAdditionalCriteria')
      .aggregate(getLatestMonthYearProjectPipeline(1), { allowDiskUse: true })
      .toArray()

    const addlCriteriaHash = _.groupBy(
      payerHistoricalAdditionalCriteria,
      d => `${d.slug} ${d.indication} ${d.population} ${d.line} ${d.coverage} ${d.book} ${d.regimen}`
    )

    combinedPayerData.forEach(obj => {
      const {
        slug,
        indication,
        population,
        line,
        coverage,
        book,
        regimen,
      } = obj

      const comboKey = `${slug} ${indication} ${population} ${line} ${coverage} ${book} ${regimen}`
      if (addlCriteriaHash[comboKey]) {
        obj.additionalCriteria = addlCriteriaHash[comboKey]
      }
    })

    // just to make it easier to see the collection output; not yet used directly by APP or API
    await pulseCoreDb.collection('payerHistoricalCombinedData').deleteMany()
    await pulseCoreDb.collection('payerHistoricalCombinedData').insertMany(combinedPayerData)
    console.log(`pulse-core collection 'payerHistoricalCombinedData' updated`)

  } catch (e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

// module.exports = consolidatePayerData
consolidatePayerData()


// Saving snippet below for potential future use:
// Join whether account has been profiled

// const payerOrganizationOverview = await pulseDevDb.collection('payerOrganizationOverview')
//   .find().toArray()

// const profiledPayerHash = _.keyBy(payerOrganizationOverview, 'slug')

// combinedPayerData.forEach(obj => {
//   if (profiledPayerHash[obj.slug]) {
//     obj.isProfiled = true
//   } else {
//     obj.isProfiled = false
//   }
// })
