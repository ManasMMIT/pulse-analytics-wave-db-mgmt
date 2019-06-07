const _ = require('lodash')
const d3 = require('d3-collection')
const connectToMongoDb = require('../connect-to-mongodb')
// const getLatestMonthYearProjectPipeline = require('./importProjectBasedData/latest-month-year-project')
const {
  getScriptTerminator,
  // latestMonthYearPipeline,
} = require('../utils')

const getLivesKey = (book, coverage) => {
  if (book.includes('Medicare')) {
    return _.camelCase(`medicare ${coverage}`)
  }
  return _.camelCase(`${book} ${coverage}`)
}

const getTreatmentPlanKey = d => (
  `${d.indication}|${d.population}|${d.line}|${d.regimen}|${getLivesKey(d.book, d.coverage)}`
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
      .find().toArray()

    // Join access objects from master access list in pulse-core
    let qualityAccessScores = await pulseCoreDb.collection('qualityAccessScores')
      .find().toArray()

    qualityAccessScores = _.keyBy(qualityAccessScores, 'access')

    // warning: order of destructuring matters here! otherwise obj's _id is overwritten, resulting in dup keys
    combinedPayerData = combinedPayerData.map(obj => ({ ...qualityAccessScores[obj.access], ...obj }))

    // Join latest month/year/project historical policy links
    const payerHistoricalPolicyLinks = await pulseDevDb.collection('payerHistoricalPolicyLinks')
      .find().toArray()

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
      .find().toArray()

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

    // // just to make it easier to see the collection output; not yet used directly by APP or API
    // await pulseCoreDb.collection('payerHistoricalCombinedData').deleteMany()
    // await pulseCoreDb.collection('payerHistoricalCombinedData').insertMany(combinedPayerData)
    // console.log(`pulse-core collection 'payerHistoricalCombinedData' updated`)

    // a 'treatmentPlan' refers to the combo of indication, regimen, population, etc.
    const payerDataGroupedByTreatmentPlan = d3.nest()
      .key(getTreatmentPlanKey)
      .rollup(arr => _.keyBy(arr, 'slug'))
      .object(combinedPayerData)

    // get latest month/year data for DRG and MMIT state lives
    const payerHistoricalDrgStateLives = await pulseDevDb.collection('payerHistoricalDrgStateLives')
      .find().toArray()

    const payerHistoricalMmitStateLives = await pulseDevDb.collection('payerHistoricalMmitStateLives')
      .find().toArray()

    const drgGroupedBySlug = d3.nest()
      .key(d => d.state)
      .key(d => d.slug)
      .rollup(arr => arr[0])
      .object(payerHistoricalDrgStateLives)

    const mmitGroupedBySlug = d3.nest()
      .key(d => d.state)
      .key(d => d.slug)
      .rollup(arr => arr[0])
      .object(payerHistoricalMmitStateLives)

    const bucketizeLivesData = (livesGroupedBySlug, payerAccessHash) => {
      const result = _.map(livesGroupedBySlug, (payers, state) => {
        const accessBuckets = _.groupBy(payers, ({ slug }) => {
          const access = payerAccessHash[slug] ? payerAccessHash[slug].access : 'Not Audited'
          return access
        })

        return {
          state,
          accessBuckets,
        }
      })

      return result
    }

    // const allPayersAcrossDrgMmit = _.merge(drgGroupedBySlug, mmitGroupedBySlug)

    // For every treatmentPlan, each payer has a given access category, provided in the payerAccessHash.
    // Add a full set of states and lives data (both MMIT and DRG) to each treatmentPlan,
    // while bucketizing the payers associated with each state by access category.
    const payerDataWithLives = _.map(payerDataGroupedByTreatmentPlan, (payerAccessHash, treatmentPlan) => {
      const DRG_statesData = bucketizeLivesData(drgGroupedBySlug, payerAccessHash)
      const MMIT_statesData = bucketizeLivesData(mmitGroupedBySlug, payerAccessHash)

      return {
        treatmentPlan,
        DRG_statesData,
        MMIT_statesData,
      }
    })

    debugger

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
