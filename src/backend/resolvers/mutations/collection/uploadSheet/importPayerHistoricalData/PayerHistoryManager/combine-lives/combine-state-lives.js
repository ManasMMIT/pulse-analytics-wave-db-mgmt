const _ = require('lodash')
const { STATE_ID_BY_ABBREV } = require('./states-data-util')
const { RESTRICTIVE_SCORE_THRESHOLD, generateAccessBuckets } = require('./combine-lives-util')

const combineStateLives = ({
  payerHistoricalDrgStateLives,
  payerHistoricalMmitStateLives,
  payerDrgStateLivesTotals,
  payerMmitStateLivesTotals,
  livesType,
  combinedPayerDataBySlug,
}) => {
  const LIVES_DATA_drgPayersByState = _.groupBy(payerHistoricalDrgStateLives, 'state')

  /*
    Note: It's been observed that there can be non-unique payers for a given state
    in MMIT lives. This was looked into and shouldn't affect lives calculations here
    because depending on the payer, either
      A) payers affiliated with state 'Other' have already been excluded at this point OR
      B) because the duplicate payers each have lives for different types of lives

    Duplicate payers are: magellan-health-services, express-scripts, baylor-scott-and-white
  */
  const LIVES_DATA_mmitPayersByState = _.groupBy(payerHistoricalMmitStateLives, 'state')

  // key the precalculated lives totals by state for easy access
  const LIVES_DATA_drgTotalsByState = _.keyBy(payerDrgStateLivesTotals, 'state')
  const LIVES_DATA_mmitTotalsByState = _.keyBy(payerMmitStateLivesTotals, 'state')

  /*
    Add a full set of states and lives data (both MMIT and DRG) to each treatmentPlan,
    while bucketing the payers for each state by access category using the
    data in the `combinedPayerDataBySlug`.

    In the process of bucketing the payers, calculate lives percentages for payers as
    well as restrictive lives percentages.
  */

  const DRG_statesData = bucketizeLivesData({
    livesData: LIVES_DATA_drgPayersByState,
    combinedPayerDataBySlug,
    livesType,
    livesTotalsByState: LIVES_DATA_drgTotalsByState,
  })

  const MMIT_statesData = bucketizeLivesData({
    livesData: LIVES_DATA_mmitPayersByState,
    combinedPayerDataBySlug,
    livesType,
    livesTotalsByState: LIVES_DATA_mmitTotalsByState,
  })

  return { DRG_statesData,  MMIT_statesData }

  function bucketizeLivesData({
    livesData,
    combinedPayerDataBySlug,
    livesType,
    livesTotalsByState,
  }) {
    let totalLivesAcrossStates = 0 // the total lives across states for this treatment plan
    let totalAuditedLivesAcrossStates = 0

    let result = _.map(livesData, (payers, state) => {
      const { stateLong } = payers[0]

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

      const accessBuckets = generateAccessBuckets({ payersWithAccessAdded, totalLives: totalLivesForStateAndLivesType })

      totalAuditedLivesAcrossStates += auditedLives

      let auditedLivesPercent = 0
      if (totalLivesForStateAndLivesType) { // to prevent division by 0
        auditedLivesPercent = auditedLives / totalLivesForStateAndLivesType
      }

      return {
        id: STATE_ID_BY_ABBREV[state],
        state,
        stateLong,
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

    result = _.orderBy(result, ['restrictiveLivesPercent'], ['desc'])

    return {
      statesData: result,
      auditedLives: totalAuditedLivesAcrossStates,
      totalLives: totalLivesAcrossStates,
      auditedLivesPercent: totalAuditedLivesAcrossStatesPercent,
    }
  }
}

module.exports = combineStateLives
