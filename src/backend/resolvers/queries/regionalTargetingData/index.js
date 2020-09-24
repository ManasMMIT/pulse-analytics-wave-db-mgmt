const getPayersForSelectedTreatmentPlan = require('./getPayersForSelectedTreatmentPlan')
const materializeStateAndNationalData = require('./materialize-state-and-national-data')
const formatStatesBreakdownForExport = require('./formatStatesBreakdownForExport')
const formatRegionalBreakdownForExport = require('./formatRegionalBreakdownForExport')
const injectRegionalAndStatesData = require('./injectRegionalAndStatesData')

const regionalTargetingData = async (
  root,
  { input: { treatmentPlan, teamId, livesSource } },
  { pulseCoreDb, pulseDevDb }
) => {
  const {
    indication,
    population,
    line,
    regimen,
    book,
    coverage,
  } = treatmentPlan
  const isClientRegeneron = livesSource !== 'DRG'

  const targetTeam = await pulseCoreDb
    .collection('roles')
    .findOne({ _id: teamId })

  const payersForSelectedTreatmentPlan = await getPayersForSelectedTreatmentPlan(
    {
      targetTeam,
      pulseDevDb,
      treatmentPlan,
    }
  )

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

  const {
    restrictiveLivesPercent: nationalRestrictiveLivesPercent,
  } = nationalData

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

  result = await injectRegionalAndStatesData({
    targetTeam,
    result,
    db: pulseDevDb,
  })

  const statesExportData = formatStatesBreakdownForExport(result.statesData)
  let breakdownsExportData = result.breakdowns.map(({ data, type }) => ({
    type,
    data: formatRegionalBreakdownForExport(data),
  }))

  return {
    statesExportData,
    breakdownsExportData,
    treatmentPlan,
    teamId,
  }
}

module.exports = regionalTargetingData
