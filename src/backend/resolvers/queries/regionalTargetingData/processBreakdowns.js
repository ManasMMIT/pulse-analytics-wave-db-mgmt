/* eslint-disable consistent-return */
const d3 = require('d3-collection')
const _ = require('lodash')

const injectEnrichedBreakdownsIntoResult = (breakdowns, result) => {
  const enrichedBreakdowns = _.cloneDeep(breakdowns).map(({ type, data }) => {
    const statesBreakdownHash = d3
      .nest()
      .key((d) => d.state)
      .rollup((arr) => arr[0])
      .object(data)

    const regionalDataRollup = (arrOfStates) => {
      const accumulator = {
        totalRestrictiveLivesAcrossStates: 0,
        totalLivesAcrossStates: 0,
        totalAuditedLivesAcrossStates: 0,
        stateIds: [],
        payers: [],
      }

      const reducedResult = arrOfStates.reduce((acc, stateObj) => {
        const {
          restrictiveLivesPercent,
          totalLives,
          auditedLives,
          accessBuckets,
        } = stateObj

        const restrictiveLivesRaw = restrictiveLivesPercent * totalLives

        const statePayers = accessBuckets.reduce(
          (payersAcrossBuckets, { payers }) => [
            ...payersAcrossBuckets,
            ...payers,
          ],
          []
        )

        acc.payers = [...acc.payers, ...statePayers]
        acc.stateIds.push(stateObj.id)
        acc.totalRestrictiveLivesAcrossStates += restrictiveLivesRaw
        acc.totalAuditedLivesAcrossStates += auditedLives
        acc.totalLivesAcrossStates += totalLives
        return acc
      }, accumulator)

      const {
        totalRestrictiveLivesAcrossStates,
        totalLivesAcrossStates,
        totalAuditedLivesAcrossStates,
        stateIds,
        payers,
      } = reducedResult

      const restrictiveLivesPercentAcrossStates =
        totalRestrictiveLivesAcrossStates / totalLivesAcrossStates
      const auditedLivesPercentAcrossStates =
        totalAuditedLivesAcrossStates / totalLivesAcrossStates

      let accessBuckets = d3
        .nest()
        .key((d) => d.slug)
        .rollup((arrOfSamePayerAcrossStates) => {
          const totalRegionalLivesForPayer = arrOfSamePayerAcrossStates.reduce(
            (regionalLives, statePayerObj) =>
              regionalLives + statePayerObj.livesRaw,
            0
          )

          const livesPercent =
            totalRegionalLivesForPayer / totalLivesAcrossStates

          return {
            ...arrOfSamePayerAcrossStates[0],
            livesRaw: totalRegionalLivesForPayer,
            livesPercent,
          }
        })
        .object(payers)

      accessBuckets = Object.values(accessBuckets)

      accessBuckets = d3
        .nest()
        .key((d) => d.access)
        .rollup((arrOfPayers) => {
          const livesAcc = { livesRaw: 0, livesPercent: 0 }

          const livesFiguresForBucket = arrOfPayers.reduce((acc, payerObj) => {
            acc.livesRaw += payerObj.livesRaw
            acc.livesPercent += payerObj.livesPercent
            return acc
          }, livesAcc)

          const orderedPayers = _.orderBy(
            arrOfPayers,
            ['livesPercent'],
            ['desc']
          )

          return {
            access: arrOfPayers[0].access,
            color: arrOfPayers[0].color,
            score: Number(arrOfPayers[0].score),
            payers: orderedPayers,
            ...livesFiguresForBucket,
          }
        })
        .object(accessBuckets)

      accessBuckets = Object.values(accessBuckets)
      accessBuckets = _.orderBy(accessBuckets, ['score'], ['desc'])

      return {
        region: statesBreakdownHash[arrOfStates[0].state].region,
        stateIds,
        restrictiveLivesPercent: restrictiveLivesPercentAcrossStates,
        totalLives: totalLivesAcrossStates,
        auditedLives: totalAuditedLivesAcrossStates,
        auditedLivesPercent: auditedLivesPercentAcrossStates,
        accessBuckets,
        states: arrOfStates,
      }
    }

    // Find the states to exclude (i.e. where its region is 'Undefined', falsey, or
    // there's no corresponding region for that state within this breakdown)
    // and adjust the national auditedLives, totalLives, and auditedLivesPercent
    // to exclude those states for this breakdown. Relatedly, make sure to only group
    // by region and do calculations for the states that are supposed to be included.
    const [statesToExclude, statesToInclude] = _.partition(
      result.statesData,
      ({ state }) => {
        const regionAffiliatedWithState =
          state in statesBreakdownHash && statesBreakdownHash[state].region
        return (
          regionAffiliatedWithState === 'Undefined' ||
          !regionAffiliatedWithState
        )
      }
    )

    const breakdownLivesData = {
      auditedLives: result.auditedLives,
      totalLives: result.totalLives,
      auditedLivesPercent: result.auditedLivesPercent,
    }

    statesToExclude.forEach(({ auditedLives, totalLives }) => {
      breakdownLivesData.auditedLives -= auditedLives
      breakdownLivesData.totalLives -= totalLives
    })

    breakdownLivesData.auditedLivesPercent =
      breakdownLivesData.auditedLives / breakdownLivesData.totalLives

    data = d3
      .nest()
      .key((d) => statesBreakdownHash[d.state].region)
      .rollup(regionalDataRollup)
      .object(_.cloneDeep(statesToInclude))

    data = Object.values(data)
    data = _.orderBy(data, ['restrictiveLivesPercent'], ['desc'])

    return { type, data, ...breakdownLivesData }
  })

  result.breakdowns = enrichedBreakdowns
}

const adjustTopLevelStatesAndLivesData = (roleBreakdowns, result) => {
  // Find all states that are excluded from every breakdown. So if we
  // have Breakdown1 and Breakdown2, and ND is not in Breakdown1 but IS in Breakdown2,
  // ND should be included. Only if ND is in neither breakdown is it excluded.

  // STEP 1: Prep result.statesData as the base data to make comparisons against
  // to determine if a state has been excluded among the breakdowns. Otherwise it's
  // impossible to determine what's mutually excluded among the breakdowns from just
  // comparing the breakdowns with each other.

  // Initialize base states as a hash that looks like { AK: false, AL: false, etc. }
  const statesTracker = _.mapValues(
    _.keyBy(result.statesData, 'state'),
    () => false
  )

  // STEP 2: If a state occurs in any given breakdown, mark it as such in statesTracker.
  // Only states that are left untouched are mutually excluded from all the breakdowns.
  // Note: Breakdowns have already been processed at this point such that unaffiliated states
  // internal to each breakdown aren't in its `data` slice so the states we're counting
  // across breakdowns are all included states.
  roleBreakdowns.forEach(({ data }) => {
    data.forEach((stateRegionObj) => {
      statesTracker[stateRegionObj.state] = true
    })
  })

  // STEP 3: Ready the hash of excluded states by filtering the statesTracker down
  // to states who did not appear in any of the regional breakdowns
  const excludedStatesHash = _.pickBy(statesTracker, (value) => value === false)

  // STEP 4: Remove those states from the top level result.statesData and the
  // audited lives figures associated with that data
  const [statesToExclude, statesToInclude] = _.partition(
    result.statesData,
    ({ state }) => state in excludedStatesHash
  )

  statesToExclude.forEach(({ auditedLives, totalLives }) => {
    result.auditedLives -= auditedLives
    result.totalLives -= totalLives
  })

  result.auditedLivesPercent = result.auditedLives / result.totalLives

  result.statesData = statesToInclude
}

const processBreakdowns = (roleBreakdowns, result) => {
  // mock data for tracing logic when you have two breakdowns,
  // one of which only has AL, and the other only has KS
  /*
    roleBreakdowns = [
      {
        type: 'regional',
        data: [
          { id: 1, state: 'AL', region: 'South' }
        ]
      },
      {
        type: 'territorial',
        data: [
          { id: 2, state: 'KS', region: 'Midwest' }
        ]
      },
    ]
  */

  if (_.isEmpty(roleBreakdowns)) {
    result.breakdowns = []
    return null
  }

  injectEnrichedBreakdownsIntoResult(roleBreakdowns, result)
  adjustTopLevelStatesAndLivesData(roleBreakdowns, result)
}

module.exports = processBreakdowns
