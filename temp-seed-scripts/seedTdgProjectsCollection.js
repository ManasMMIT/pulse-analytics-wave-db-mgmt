const _ = require('lodash')

const ENRICH_TP_FIELDS_PIPELINE = require('./enrich-tps-pipeline')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerOrganizationsBySlug,
}) => {
  await pulseCore.collection('tdgProjects').deleteMany()

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|'),
  )

  const orgTps = await pulseCore.collection('organizations.treatmentPlans')
    .find({}).toArray()

  const orgTpsByRefs = _.groupBy(
    orgTps,
    ({ organizationId, treatmentPlanId }) => [organizationId, treatmentPlanId].join('|')
  )

  const allTheThings = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    // ...payerHistoricalPolicyLinks,
  ]

  const onlyOrgTreatmentPlanDocs = allTheThings.filter(thing => (
    thing.project
    && thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
  ))

  const groupedByProject = _.groupBy(onlyOrgTreatmentPlanDocs, 'project')

  Object.keys(groupedByProject).forEach(project => {
    groupedByProject[project] = _.uniqBy(
      groupedByProject[project],
      ({ indication, regimen, line, population, book, coverage, slug }) => [indication, regimen, line, population, book, coverage, slug].join('|')
    )
  })

  const seenOrgTpIds = {}
  const dupeOrgTpIds = []

  const tdgProjects = Object.keys(groupedByProject).map(project => {
    const historicalDocsInProject = groupedByProject[project]

    let orgTps = historicalDocsInProject
      .map(({ indication, regimen, line, population, book, coverage, slug }) => {
        const { _id: organizationId } = payerOrganizationsBySlug[slug] || {}

        const tpHashStr = [indication, regimen, line, population, book, coverage].join('|')
        const { _id: treatmentPlanId } = hashedTps[tpHashStr] ? hashedTps[tpHashStr][0] : {}

        if (!organizationId || !treatmentPlanId) return null

        const orgTpKey = [organizationId, treatmentPlanId].join('|')
        const orgTp = orgTpsByRefs[orgTpKey]

        if (!orgTp) return null

        const orgTpId = orgTp[0]._id

        if (seenOrgTpIds[orgTpId]) {
          dupeOrgTpIds.push({
            project,
            conflictCombo: seenOrgTpIds[orgTpId],
            orgTpId,
          })
          
          return null
        }

        seenOrgTpIds[orgTpId] = `${project}|${slug}|${tpHashStr}`

        return orgTpId
      })

    orgTps = _.compact(orgTps)

    return {
      name: project,
      orgTpIds: orgTps
    }
  })

  if (!_.isEmpty(dupeOrgTpIds)) {
    console.error('Warning! Either intra- or inter- project orgTpId conflicts')
    console.log(dupeOrgTpIds)
  }

  await pulseCore.collection('tdgProjects').insertMany(tdgProjects)

  console.log('`tdgProjects` collection seeded/n')
}
