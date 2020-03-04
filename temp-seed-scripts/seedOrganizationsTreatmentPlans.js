const _ = require('lodash')

const ENRICH_TP_FIELDS_PIPELINE = require('./enrich-tps-pipeline')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('organizations.treatmentPlans-2')
    .deleteMany()

  const orgs = await pulseCore.collection('organizations').find({}).toArray()

  const orgsBySlug = _.groupBy(orgs, 'slug')

  const allTheThings = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const onlyTreatmentPlanDocsWithOrgs = allTheThings.filter(thing => (
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

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans-2')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|'),
  )

  const organizationTreatmentPlanDocs = uniqOrgTpsDocs
    .reduce((acc, { slug, indication, regimen, population, line, book, coverage }) => {
      // need to all be _ids
      const stringHash = [indication, regimen, line, population, book, coverage].join('|')
      const treatmentPlan = hashedTps[stringHash]
      const organization = orgsBySlug[slug]

      if (!treatmentPlan || !organization) return acc

      acc.push({
        treatmentPlanId: treatmentPlan[0]._id,
        organizationId: organization[0]._id,
      })

      return acc
    }, [])

  await pulseCore.collection('organizations.treatmentPlans-2')
    .insertMany(organizationTreatmentPlanDocs)

  console.log('`organizations.treatmentPlans` seeded');
}
