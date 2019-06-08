const _ = require('lodash')
const d3 = require('d3-collection')
const connectionWrapper = require('./connection-wrapper')

let combineLives = async ({
  pulseDevDb,
  terminateScript,
  payerHistoricalCombinedData,
}) => {
  try {
    // fetch all the data we'll need to work with simultaneously upfront
    const [
      payerHistoricalDrgStateLives,
      payerHistoricalMmitStateLives,
      combinedPayerData,
    ] = await Promise.all([
      pulseDevDb.collection('payerHistoricalDrgStateLives').find().toArray(),
      pulseDevDb.collection('payerHistoricalMmitStateLives').find().toArray(),
      payerHistoricalCombinedData || pulseDevDb.collection('payerHistoricalCombinedData').find().toArray()
    ])

    // group the combinedPayerData by `treatmentPlan` combination,
    // while special-casing for `Medicare` lives
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
    const payerDataWithStateLives = _.map(payerDataGroupedByTreatmentPlan, generateStateLivesData)

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

    return payerDataWithStateLives
  } catch (e) {
    console.error(e)
    await terminateScript()
  }
}

combineLives = connectionWrapper(combineLives)
module.exports = combineLives
