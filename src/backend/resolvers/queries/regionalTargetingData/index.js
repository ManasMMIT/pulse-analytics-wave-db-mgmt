const d3 = require('d3-collection')
const _ = require('lodash')

const materializeStateAndNationalData = require('./materialize-state-and-national-data')
const formatStatesBreakdownForExport = require('./formatStatesBreakdownForExport')
const formatRegionalBreakdownForExport = require('./formatRegionalBreakdownForExport')

const REGIONAL_TARGETING_ID = '4e6304a5-4847-474f-a8f8-9cbeb8a77677'
const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'

const regionalTargetingData = async (
  root, 
  {
    input: {
      treatmentPlan,
      teamId,
      livesSource,
    }
  }, 
  { pulseCoreDb, pulseDevDb }, 
) => {
  const { indication, population, line, regimen, book, coverage } = treatmentPlan

  const isClientRegeneron = livesSource !== 'DRG'

  const targetTeam = await pulseCoreDb.collection('roles').findOne({ _id: teamId })

  const { regionalBreakdown } = (targetTeam.resources || [])
    .find(({ nodeId }) => nodeId === REGIONAL_TARGETING_ID) || {}

  const firstUser = targetTeam.users[0]
  if (!firstUser) throw new Error("Selected team must have at least one user")

  const firstUserId = firstUser._id

  const targetUser = await pulseDevDb.collection('users.nodes.resources')
    .findOne({ _id: firstUserId }) 

  const payerToolNodeResources = targetUser.resources.find(({ nodeId }) => PAYER_TOOL_ID === nodeId)

  if (!payerToolNodeResources) throw new Error("Selected team doesn't have access to payer tool")

  const { accounts, treatmentPlans } = payerToolNodeResources
  const permittedSlugs = accounts.map(({ slug }) => slug)
  
  const permittedIndRegCombos = treatmentPlans.reduce((acc, { name: indication, regimens }) => {
    regimens.forEach(({ name: regimen }) => {
      acc.push({ indication, regimen })
    })

    return acc
  }, [])

  const payersForSelectedTreatmentPlan = await pulseDevDb.collection('payerHistoricalCombinedData')
    .find({
      ...treatmentPlan,
      slug: { $in: permittedSlugs },
      $or: permittedIndRegCombos,
    })
    .toArray()

  if (_.isEmpty(payersForSelectedTreatmentPlan)) {
    throw new Error("No quality of access data for selected treatment plan and role")
  }

  const {
    statesDataWithAuditedLives,
    nationalData,
  } = await materializeStateAndNationalData({
    treatmentPlan,
    payersForSelectedTreatmentPlan,
    isClientRegeneron,
    pulseDevDb,
    pulseCoreDb,
  })

  const { restrictiveLivesPercent: nationalRestrictiveLivesPercent } = nationalData

  let result = {
    indication,
    population,
    line,
    regimen,
    book,
    coverage,
    ...statesDataWithAuditedLives,
    nationalRestrictiveLivesPercent,
  }

  if (!_.isEmpty(regionalBreakdown)) {
    const statesRegionsHash = d3.nest()
      .key(d => d.state)
      .rollup(arr => arr[0])
      .object(regionalBreakdown)

    // recalculate the national auditedLives, totalLives, and auditedLivesPercent
    // if there are excluded states, and reassign statesData to only consist of
    // states who have a region (i.e. where the region isn't 'Undefined' or blank)
    const [statesToExclude, statesToInclude] = _.partition(result.statesData, ({ state }) => {
      const regionAffiliatedWithState = statesRegionsHash[state].region
      return regionAffiliatedWithState === 'Undefined' || !regionAffiliatedWithState
    })

    statesToExclude.forEach(({ auditedLives, totalLives }) => {
      result.auditedLives -= auditedLives
      result.totalLives -= totalLives
    })

    result.auditedLivesPercent = result.auditedLives / result.totalLives

    result.statesData = statesToInclude

    const statesData = result.statesData

    const regionalDataRollup = arrOfStates => {
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

        const statePayers = accessBuckets.reduce((payersAcrossBuckets, { payers }) => [...payersAcrossBuckets, ...payers], [])

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

      const restrictiveLivesPercentAcrossStates = totalRestrictiveLivesAcrossStates / totalLivesAcrossStates
      const auditedLivesPercentAcrossStates = totalAuditedLivesAcrossStates / totalLivesAcrossStates

      let accessBuckets = d3.nest()
        .key(d => d.slug)
        .rollup(arrOfSamePayerAcrossStates => {
          const totalRegionalLivesForPayer = arrOfSamePayerAcrossStates.reduce((regionalLives, statePayerObj) => regionalLives + statePayerObj.livesRaw, 0)

          const livesPercent = totalRegionalLivesForPayer / totalLivesAcrossStates

          return {
            ...arrOfSamePayerAcrossStates[0],
            livesRaw: totalRegionalLivesForPayer,
            livesPercent,
          }
        })
        .object(payers)

      accessBuckets = Object.values(accessBuckets)

      accessBuckets = d3.nest()
        .key(d => d.access)
        .rollup(arrOfPayers => {
          const livesAcc = { livesRaw: 0, livesPercent: 0 }

          const livesFiguresForBucket = arrOfPayers.reduce((acc, payerObj) => {
            acc.livesRaw += payerObj.livesRaw
            acc.livesPercent += payerObj.livesPercent
            return acc
          }, livesAcc)

          const orderedPayers = _.orderBy(arrOfPayers, ['livesPercent'], ['desc'])

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
        region: statesRegionsHash[arrOfStates[0].state].region,
        stateIds,
        restrictiveLivesPercent: restrictiveLivesPercentAcrossStates,
        totalLives: totalLivesAcrossStates,
        auditedLives: totalAuditedLivesAcrossStates,
        auditedLivesPercent: auditedLivesPercentAcrossStates,
        accessBuckets,
        states: arrOfStates,
      }
    }

    let regionalData = d3.nest()
      .key(d => statesRegionsHash[d.state].region)
      .rollup(regionalDataRollup)
      .object(statesData)

    regionalData = Object.values(regionalData)
    regionalData = _.orderBy(regionalData, ['restrictiveLivesPercent'], ['desc'])

    result = { ...result, regionalData }
  }

  const statesExportData = formatStatesBreakdownForExport(result.statesData)
  
  let regionalExportData = []
  
  if (result.regionalData) {
    regionalExportData = formatRegionalBreakdownForExport(result.regionalData)
  }

  return { 
    statesExportData, 
    regionalExportData, 
    treatmentPlan,
    teamId,
  }
}

module.exports = regionalTargetingData
