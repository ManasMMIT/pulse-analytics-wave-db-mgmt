const _ = require('lodash')
const d3 = require('d3-collection')
const connectToMongoDb = require('../connect-to-mongodb')
const {
  getScriptTerminator,
} = require('../utils')

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
    /*
      * * PLAN OF ATTACK * *

      STEP 1:
        Join all the latest month/year/project payer data together.
        That means: 1. qoa 2. access scores 3. policy links 4. additional criteria.
        That'll get us `combinedPayerData`.

      STEP 2:
        For every `treatmentPlan` in `combinedPayerData`
        (`treatmentPlan` is combination of indication, population, line,
        regimen, book, coverage), work in the DRG and MMIT state lives data so
        we can get a result that's the breakdown of payers and their lives by access
        category for every state for every `treatmentPlan`.
    */

    // fetch all the data we'll need to work with simultaneously upfront
    const [
      payerHistoricalQualityAccess,
      qualityAccessScores,
      payerHistoricalPolicyLinks,
      payerHistoricalAdditionalCriteria,
      payerHistoricalDrgStateLives,
      payerHistoricalMmitStateLives,
    ] = await Promise.all([
      pulseDevDb.collection('payerHistoricalQualityAccess').find().toArray(),
      pulseCoreDb.collection('qualityAccessScores').find().toArray(), // this master collection is in CORE
      pulseDevDb.collection('payerHistoricalPolicyLinks').find().toArray(),
      pulseDevDb.collection('payerHistoricalAdditionalCriteria').find().toArray(),
      pulseDevDb.collection('payerHistoricalDrgStateLives').find().toArray(),
      pulseDevDb.collection('payerHistoricalMmitStateLives').find().toArray(),
    ])

    // Starting point is payerHistoricalQualityAccess
    let combinedPayerData = _.merge([], payerHistoricalQualityAccess)

    // First join the access properties such as score to combinedPayerData
    const accessScoresByAccess = _.keyBy(qualityAccessScores, 'access')
    // WARNING: order of destructuring matters here! otherwise obj's _id is overwritten, resulting in dup keys
    combinedPayerData = combinedPayerData.map(obj => ({ ...qualityAccessScores[obj.access], ...obj }))

    // Next join the policy links
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

    // Join the additional criteria
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

    // * Write the combinedPayerData to MongoDB for future use
    // await pulseDevDb.collection('payerHistoricalCombinedData').deleteMany()
    // await pulseDevDb.collection('payerHistoricalCombinedData').insertMany(combinedPayerData)
    // console.log(`pulse-core collection 'payerHistoricalCombinedData' updated`)

    // * We now move onto Step 2, the state lives side of things

    const payerDataGroupedByTreatmentPlan = d3.nest()
      .key(getTreatmentPlanKey)
      .rollup(arr => _.keyBy(arr, 'slug'))
      .object(combinedPayerData)

    function getTreatmentPlanKey(d) {
      return `${d.indication}|${d.population}|${d.line}|${d.regimen}|${getLivesKey(d.book, d.coverage)}`
    }

    function getLivesKey(book, coverage) {
      if (book.includes('Medicare')) {
        return _.camelCase(`medicare ${coverage}`)
      }
      return _.camelCase(`${book} ${coverage}`)
    }

    // group the payers and their lives data by state
    // TODO: add validation to make sure same payer doesn't appear more than once for a given state
    const LIVES_DATA_drgPayersByState = _.groupBy(payerHistoricalDrgStateLives, 'state')
    const LIVES_DATA_mmitPayersByState = _.groupBy(payerHistoricalMmitStateLives, 'state')

    /*
      Add a full set of states and lives data (both MMIT and DRG) to each treatmentPlan,
      while bucketing the payers for each state by access category using the
      data in the `combinedPayerDataBySlug`.
    */
    const payerDataWithLives = _.map(payerDataGroupedByTreatmentPlan, generateStateLivesData)

    function generateStateLivesData(combinedPayerDataBySlug, treatmentPlan) {
      const livesType = _.last(treatmentPlan.split('|'))

      const DRG_statesData = bucketizeLivesData({
        livesData: LIVES_DATA_drgPayersByState,
        combinedPayerDataBySlug,
        livesType,
      })

      const MMIT_statesData = bucketizeLivesData({
        livesData: LIVES_DATA_mmitPayersByState,
        combinedPayerDataBySlug,
        livesType,
      })

      return {
        treatmentPlan,
        DRG_statesData,
        MMIT_statesData,
      }
    }

    function bucketizeLivesData({
      livesData,
      combinedPayerDataBySlug,
      livesType,
    }) {
      const result = _.map(livesData, (payers, state) => {
        /*
          Note: Some commented out code has been left in below in case
          we need to add in payers who aren't profiled in QOA data. But there's
          a lot of them. Not sure if meaningful to user.
        */

        // let notAuditedPayers = []
        let payersWithAccessAdded = _.reduce(payers, (acc, payerObj) => {
          const { slug } = payerObj

          // skip payers who aren't profiled in qoa data for the given treatment plan
          if (!combinedPayerDataBySlug[slug]) {
            // notAuditedPayers.push(payerObj)
            return acc
          }

          // also skip the payer if the lives for the livesType is 0 or absent
          if (!Number(payerObj[livesType])) return acc

          const combinedPayerData = combinedPayerDataBySlug[slug]
          acc.push({ ...payerObj, ...combinedPayerData })

          return acc
        }, [])

        /*
          notAuditedPayers = notAuditedPayers.map(payerObj => ({
            ...payerObj,
            access: 'Not Audited',
            color: 'gray',
            // other properties needed for not audited
          }))

          payersWithAccessAdded = payersWithAccessAdded.concat(notAuditedPayers)
        */

        // group the payers by access
        const accessBuckets = _.groupBy(payersWithAccessAdded, 'access')

        return {
          state,
          accessBuckets,
        }
      })

      return result
    }

  } catch (e) {
    console.error(e)
  } finally {
    console.log('Script terminating...')
    await terminateScript()
  }
}

// module.exports = consolidatePayerData
consolidatePayerData()

/*
Saving snippet below for potential future use:
Join whether account has been profiled

const profiledPayerHash = _.keyBy(payerOrganizationOverview, 'slug')

combinedPayerData.forEach(obj => {
  if (profiledPayerHash[obj.slug]) {
    obj.isProfiled = true
  } else {
    obj.isProfiled = false
  }
})
*/
