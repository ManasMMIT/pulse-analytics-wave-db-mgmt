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

  const orgsIdMap = orgs.reduce((acc, { slug, _id }) => {
    acc[slug] = _id

    return acc
  }, {})

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
    thing => thing.slug + thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage
  )

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans-2')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage,
  )

  const ops = uniqOrgTpsDocs
    .map(async ({ slug, indication, regimen, population, line, book, coverage }) => {
      // need to all be _ids
      const stringHash = indication + regimen + line + population + book + coverage
      const treatmentPlan = hashedTps[stringHash] || [{}]

      return {
        treatmentPlanId: treatmentPlan[0]._id,
        organizationId: orgsIdMap[slug],
      }
    })

  const organizationTreatmentPlanDocs = await Promise.all(ops)

  await pulseCore.collection('organizations.treatmentPlans-2')
    .insertMany(organizationTreatmentPlanDocs)

  // ! any slugs that are missing from master list are null
  await pulseCore.collection('organizations.treatmentPlans-2')
    .deleteMany({
      $or: [
        { organizationId: null },
        { treatmentPlanId: null },
      ]
    })

  console.log('`organizations.treatmentPlans` seeded');
}
