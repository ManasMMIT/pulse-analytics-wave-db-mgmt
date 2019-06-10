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
      pulseDevDb.collection('payerHistoricalDrgStateLives').find().toArray(),
      pulseDevDb.collection('payerHistoricalMmitStateLives').find().toArray(),
      pulseCoreDb.collection('payerDrgStateLivesTotals').find().toArray(),
      pulseCoreDb.collection('payerMmitStateLivesTotals').find().toArray(),
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

      In the process of bucketing the payers, calculate lives percentages for payers as
      well as restrictive lives percentages.
    */
    const drgStatesLivesTotalsByState = _.keyBy(payerDrgStateLivesTotals, 'state')
    const mmitStatesLivesTotalsByState = _.keyBy(payerMmitStateLivesTotals, 'state')

    const payerDataWithStateLives = _.map(payerDataGroupedByTreatmentPlan, generateStateLivesData)

    function generateStateLivesData(combinedPayerDataBySlug, treatmentPlan) {
      const livesType = _.last(treatmentPlan.split('|'))

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
        treatmentPlan,
        DRG_statesData,
        MMIT_statesData,
      }
    }

    function bucketizeLivesData({
      livesData,
      combinedPayerDataBySlug,
      livesType,
      livesTotalsByState,
    }) {
      const result = _.map(livesData, (payers, state) => {
        /*
          Note: Some commented out code has been left in below in case
          we need to add in payers who aren't profiled in QOA data. But there's
          a lot of them. Not sure if meaningful to user.
        */

        let notAuditedPayers = []
        let auditedLives = 0 // total audited lives for the current state
        const totalLivesForStateAndLivesType = livesTotalsByState[state][livesType]
        let restrictiveLivesPercent = 0

        let payersWithAccessAdded = _.reduce(payers, (acc, payerObj) => {
          const lives = Number(payerObj[livesType])
          // skip the payer if the lives for the livesType is 0 or absent
          if (!lives) return acc

          const { slug } = payerObj
          // skip payers who aren't profiled in qoa data for the given treatment plan
          const qoaDataForSlug = combinedPayerDataBySlug[slug]
          if (!qoaDataForSlug) {
            notAuditedPayers.push(payerObj)
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
combineLives()


  // "indication": "NSCLC",
  // "population": "No Subtype Specified",
  // "line": "1L+",
  // "regimen": "Keytruda",
  // "book": "Commercial",
  // "coverage": "Medical",
  // "treatmentPlan": "NSCLC|No Subtype Specified|1L+|Keytruda|commercialMedical",
  // "auditedLives": 160078898,
  // "totalLives": 169395659,
  // "auditedLivesPercent": 0.945,
