const _ = require('lodash')

const ENRICH_TP_FIELDS_PIPELINE = require('./enrich-tps-pipeline')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerOrganizationsBySlug,
}) => {
  await pulseCore.collection('organizations.treatmentPlans')
    .deleteMany()
  
  // ! quality of access is the source of truth for valid PTPs
  const onlyTreatmentPlanDocsWithOrgs = payerHistoricalQualityAccess.filter(thing => (
    thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
  ))

  const uniqOrgTpsDocs = _.uniqBy(
    onlyTreatmentPlanDocsWithOrgs,
    thing => [thing.slug, thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|')
  )

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.keyBy(
    enrichedTreatmentPlan,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|'),
  )

  const organizationTreatmentPlanDocs = uniqOrgTpsDocs
    .reduce((acc, { slug, indication, regimen, population, line, book, coverage }) => {
      // need to all be _ids
      const stringHash = [indication, regimen, line, population, book, coverage].join('|')
      const treatmentPlan = hashedTps[stringHash]
      const organization = payerOrganizationsBySlug[slug]

      if (!treatmentPlan || !organization) return acc

      acc.push({
        treatmentPlanId: treatmentPlan._id,
        organizationId: organization._id,
      })

      return acc
    }, [])

  await pulseCore.collection('organizations.treatmentPlans')
    .insertMany(organizationTreatmentPlanDocs)

  console.log('`organizations.treatmentPlans` seeded');
}
