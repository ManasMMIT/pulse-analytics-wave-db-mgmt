const _ = require('lodash')
const format = require('date-fns/format')

const ENRICH_TP_FIELDS_PIPELINE = require('./enrich-tps-pipeline')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
  payerOrganizationsBySlug,
}) => {
  await pulseCore.collection('organizations.treatmentPlans.history')
    .deleteMany()

  const allTheThings = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
  ]

  // only deal with docs that have all required fields for this historic collection
  const onlyTreatmentPlanDocsWithOrgsMonthYear = allTheThings.filter(thing => (
    thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
    && thing.month
    && thing.year
  ))

  // create hashes of all collections
  const groupedOrgTpsMonthYearDocs = _.groupBy(
    onlyTreatmentPlanDocsWithOrgsMonthYear,
    thing => [thing.slug, thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage, thing.month, thing.year].join('|')
  )

  const onlyPolicyLinksWithAllFields = payerHistoricalPolicyLinks.filter(thing => (
    thing.slug
    && thing.regimen
    && thing.book
    && thing.coverage
    && thing.month
    && thing.year
  ))

  const policyLinksGroupedbyTpParts = _.groupBy(
    onlyPolicyLinksWithAllFields,
    thing => [thing.slug, thing.regimen, thing.book, thing.coverage, thing.month, thing.year].join('|')
  )

  const accessScores = await pulseCore.collection('qualityOfAccessScore')
    .find({}).toArray()

  const accessScoresGroupedByAccess = _.groupBy(accessScores, 'access')

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|'),
  )

  const orgTreatmentPlanDocs = await pulseCore.collection('organizations.treatmentPlans')
    .find().toArray()

  const hashedOrgTpDocs = _.groupBy(
    orgTreatmentPlanDocs,
    doc => [doc.organizationId, doc.treatmentPlanId].join('|')
  )

  const docs = []
  for (let uniqOrgTpTimeString in groupedOrgTpsMonthYearDocs) {
    const comboDocs = groupedOrgTpsMonthYearDocs[uniqOrgTpTimeString]

    const flatDoc = Object.assign({}, ...comboDocs)

    const policyLinkHash = [flatDoc.slug, flatDoc.regimen, flatDoc.book, flatDoc.coverage, flatDoc.month, flatDoc.year].join('|')
    const policyLinkData = policyLinksGroupedbyTpParts[policyLinkHash] || []

    const links = policyLinkData[0]
      ? {
        policyLink: policyLinkData[0].link,
        dateTracked: policyLinkData[0].dateTracked,
        paLink: policyLinkData[0].paLink,
        project: policyLinkData[0].project,
        siteLink: policyLinkData[0].siteLink,
      }
      : null

    const hashForTps = [flatDoc.indication, flatDoc.regimen, flatDoc.line, flatDoc.population, flatDoc.book, flatDoc.coverage].join('|')

    const treatmentPlan = hashedTps[hashForTps]

    if (!treatmentPlan) continue

    const treatmentPlanId = treatmentPlan[0]
      ? treatmentPlan[0]._id
      : null

    const organization = payerOrganizationsBySlug[flatDoc.slug]

    if (!organization) continue

    const organizationId = organization
      ? organization._id
      : null

    const accessScore = accessScoresGroupedByAccess[flatDoc.access] || []

    const correctIsoFormat = format(new Date(flatDoc.year, flatDoc.month - 1, 1), 'yyyy-MM-dd')
    const timestamp = new Date(correctIsoFormat)

    const orgTpIdHashKey = [organizationId, treatmentPlanId].join('|')
    const orgTpIdHashVal = hashedOrgTpDocs[orgTpIdHashKey]

    if (!orgTpIdHashVal) continue

    const orgTpId = orgTpIdHashVal[0]
      ? orgTpIdHashVal[0]._id
      : null

    const doc = {
      orgTpId,
      organizationId,
      treatmentPlanId,
      accessData: accessScore[0] || null,
      tierData: {
        tier: flatDoc.tier,
        tierRating: flatDoc.tierRating,
        tierTotal: flatDoc.tierTotal,
      },
      timestamp,
      project: flatDoc.project,
      policyLinkData: links,
      additionalCriteriaData: {
        criteria: flatDoc.criteria,
        criteriaNotes: flatDoc.criteriaNotes,
        restrictionLevel: flatDoc.restrictionLevel,
        subPopulation: flatDoc.subPopulation,
        lineOfTherapy: flatDoc.lineOfTherapy,
      }
    }

    docs.push(doc)
  }

  await pulseCore.collection('organizations.treatmentPlans.history')
    .insertMany(docs)

  console.log('`organizations.treatmentPlans.history` seeded')
}
