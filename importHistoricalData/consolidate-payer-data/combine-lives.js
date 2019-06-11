const _ = require('lodash')
const d3 = require('d3-collection')
const connectionWrapper = require('./connection-wrapper')

const RESTRICTIVE_SCORE_THRESHOLD = 11

let combineLives = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
  payerHistoricalCombinedData,
}) => {
  try {
    // fetch all the data we'll need to work with simultaneously upfront
    const [
      payerHistoricalDrgStateLives,
      payerHistoricalMmitStateLives,
      payerDrgStateLivesTotals,
      payerMmitStateLivesTotals,
      combinedPayerData,
    ] = await Promise.all([
      pulseDevDb.collection('payerHistoricalDrgStateLives')
        .find({ state: { $nin: ['GU', 'PR', 'Other'] } }).toArray(), // don't include these states in lives calculations
      pulseDevDb.collection('payerHistoricalMmitStateLives')
        .find({ state: { $nin: ['GU', 'PR', 'Other'] } }).toArray(), // don't include these states in lives calculations
      pulseCoreDb.collection('payerDrgStateLivesTotals').find().toArray(),
      pulseCoreDb.collection('payerMmitStateLivesTotals').find().toArray(),
      payerHistoricalCombinedData || pulseDevDb.collection('payerHistoricalCombinedData').find().toArray()
    ])

    // group the combinedPayerData by `treatmentPlan` combination
    const payerDataGroupedByTreatmentPlan = d3.nest()
      .key(getTreatmentPlanKey)
      .rollup(arr => _.keyBy(arr, 'slug'))
      .object(combinedPayerData)

    function getTreatmentPlanKey(d) {
      return `${d.indication}|${d.population}|${d.line}|${d.regimen}|${d.book}|${d.coverage}`
    }

    // group the payers and their lives data by state
    // TODO: add validation to make sure same payer doesn't appear more than once for a given state
    const LIVES_DATA_drgPayersByState = _.groupBy(payerHistoricalDrgStateLives, 'state')
    const LIVES_DATA_mmitPayersByState = _.groupBy(payerHistoricalMmitStateLives, 'state')

    /*
      Add a full set of states and lives data (both MMIT and DRG) to each treatmentPlan,
      while bucketing the payers for each state by access category using the
      data in the `combinedPayerDataBySlug`.

      In the process of bucketing the payers, calculate lives percentages for payers as
      well as restrictive lives percentages.
    */
    const drgStatesLivesTotalsByState = _.keyBy(payerDrgStateLivesTotals, 'state')
    const mmitStatesLivesTotalsByState = _.keyBy(payerMmitStateLivesTotals, 'state')

    const payerDataWithStateLives = _.map(payerDataGroupedByTreatmentPlan, generateStateLivesData)

    function generateStateLivesData(combinedPayerDataBySlug, treatmentPlan) {
      const [indication, population, line, regimen, book, coverage] = treatmentPlan.split('|')
      const livesType = getLivesKey(book, coverage)

      const DRG_statesData = bucketizeLivesData({
        livesData: LIVES_DATA_drgPayersByState,
        combinedPayerDataBySlug,
        livesType,
        livesTotalsByState: drgStatesLivesTotalsByState,
      })

      const MMIT_statesData = bucketizeLivesData({
        livesData: LIVES_DATA_mmitPayersByState,
        combinedPayerDataBySlug,
        livesType,
        livesTotalsByState: mmitStatesLivesTotalsByState,
      })

      return {
        indication,
        population,
        line,
        regimen,
        book,
        coverage,
        treatmentPlan,
        DRG_statesData,
        MMIT_statesData,
      }
    }

    function getLivesKey(book, coverage) {
      if (book.includes('Medicare')) {
        return _.camelCase(`medicare ${coverage}`)
      }
      return _.camelCase(`${book} ${coverage}`)
    }

    function bucketizeLivesData({
      livesData,
      combinedPayerDataBySlug,
      livesType,
      livesTotalsByState,
    }) {
      let totalLivesAcrossStates = 0 // the total lives across states for this treatment plan
      let totalAuditedLivesAcrossStates = 0

      const result = _.map(livesData, (payers, state) => {
        /*
          Note: Some commented out code has been left in below in case
          we need to add in payers who aren't profiled in QOA data. But there's
          a lot of them. Not sure if meaningful to user.
        */

        // let notAuditedPayers = []
        let auditedLives = 0 // total audited lives for the current state

        const totalLivesForStateAndLivesType = livesTotalsByState[state][livesType]
        totalLivesAcrossStates += totalLivesForStateAndLivesType

        let restrictiveLivesPercent = 0

        let payersWithAccessAdded = _.reduce(payers, (acc, payerObj) => {
          const lives = Number(payerObj[livesType])
          // skip the payer if the lives for the livesType is 0 or absent
          if (!lives) return acc

          const { slug } = payerObj
          // skip payers who aren't profiled in qoa data for the given treatment plan
          const qoaDataForSlug = combinedPayerDataBySlug[slug]
          if (!qoaDataForSlug) {
            // notAuditedPayers.push(payerObj)
            return acc
          }

          let livesPercent = 0
          if (totalLivesForStateAndLivesType) { // to prevent division by 0
            livesPercent = lives / totalLivesForStateAndLivesType
          }

          if (Number(qoaDataForSlug.score) >= RESTRICTIVE_SCORE_THRESHOLD) {
            restrictiveLivesPercent += livesPercent
          }

          auditedLives += lives

          const combinedPayerData = combinedPayerDataBySlug[slug]
          acc.push({ ...combinedPayerData, livesPercent, livesRaw: lives })

          return acc
        }, [])

        /*
        notAuditedPayers = notAuditedPayers.map(payerObj => ({
          ...payerObj,
          access: 'Not Audited',
          // other properties needed for not audited
          // color: 'gray',
        }))

        payersWithAccessAdded = payersWithAccessAdded.concat(notAuditedPayers)
        */

        // group the payers by access, restructure as needed
        let accessBuckets = d3.nest()
          .key(d => d.access)
          .rollup(arr => {
            const livesRaw = arr.reduce((acc, payerObj) => acc + payerObj.livesRaw, 0)
            const livesPercent = livesRaw / totalLivesForStateAndLivesType

            return {
              access: arr[0].access,
              score: Number(arr[0].score),
              color: arr[0].color,
              livesRaw,
              livesPercent,
              payers: arr
            }
          })
          .object(payersWithAccessAdded)

        accessBuckets = Object.values(accessBuckets)
        accessBuckets = _.orderBy(accessBuckets, ['score'], ['desc'])

        totalAuditedLivesAcrossStates += auditedLives

        let auditedLivesPercent = 0
        if (totalLivesForStateAndLivesType) { // to prevent division by 0
          auditedLivesPercent = auditedLives / totalLivesForStateAndLivesType
        }

        return {
          state,
          auditedLives,
          totalLives: totalLivesForStateAndLivesType,
          auditedLivesPercent,
          restrictiveLivesPercent,
          accessBuckets,
        }
      })

      let totalAuditedLivesAcrossStatesPercent = 0
      if (totalLivesAcrossStates) { // to prevent division by 0
        totalAuditedLivesAcrossStatesPercent = totalAuditedLivesAcrossStates / totalLivesAcrossStates
      }

      return {
        statesData: result,
        auditedLives: totalAuditedLivesAcrossStates,
        totalLives: totalLivesAcrossStates,
        auditedLivesPercent: totalAuditedLivesAcrossStatesPercent,
      }
    }

    await pulseDevDb.collection('payerCombinedStateLives').deleteMany()
    await pulseDevDb.collection('payerCombinedStateLives').insertMany(payerDataWithStateLives)
    console.log(`Updated 'payerCombinedStateLives' collection in pulse-dev`)

    return payerDataWithStateLives
  } catch (e) {
    await terminateScript(e)
  }
}

combineLives = connectionWrapper(combineLives)
module.exports = combineLives
