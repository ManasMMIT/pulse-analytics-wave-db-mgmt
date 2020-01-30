const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'
const MERCK_PIPE_SCRIPT_USER = 'auth0|5e287871544fad0f3bf5f421'

const merckProjectsPromise = async db => {
  const merckAdminResources = await db
    .collection('users.nodes.resources')
    .findOne({ _id: MERCK_PIPE_SCRIPT_USER })

  const { treatmentPlans } = merckAdminResources.resources
    .find(({ nodeId }) => nodeId === PAYER_TOOL_ID)

  const queryDocument = {
    indication: { $ne: 'CINV' },
    coverage: 'Medical',
  }

  let treatmentPlanAggStages = []
  treatmentPlans.forEach(indicationObj => {
    const combos = indicationObj.regimens
      .map(({ name: regimenName }) => ({
        regimen: regimenName,
        indication: indicationObj.name,
      }))

    treatmentPlanAggStages = [
      ...treatmentPlanAggStages,
      ...combos,
    ]
  })

  queryDocument['$or'] = treatmentPlanAggStages

  const merckKeytrudaData = await db.collection('payerHistoricalQualityAccess')
    .find(queryDocument).toArray()

  return { merckKeytrudaData }
}

const renflexisQuery = db => {
  return db.collection('renflexisRelativeQoa')
    .find({ coverage: 'Medical' })
    .toArray()
}

module.exports = {
  merckProjectsPromise,
  renflexisQuery
}
