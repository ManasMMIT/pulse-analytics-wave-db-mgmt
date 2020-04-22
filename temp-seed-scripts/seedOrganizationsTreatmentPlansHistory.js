const _ = require('lodash')
const format = require('date-fns/format')
const { zonedTimeToUtc } = require('date-fns-tz')

const ENRICH_TP_FIELDS_PIPELINE = require('./enrich-tps-pipeline')
const DEFAULT_TIMEZONE = require('../src/backend/utils/defaultTimeZone')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
  payerOrganizationsBySlug,
}) => {
  await pulseCore.collection('organizations.treatmentPlans.history')
    .deleteMany()

  const pTpGrouper = thing => [thing.slug, thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage, thing.month, thing.year].join('|')

  const additionalCriteriaGroupedByTpParts = _.groupBy(
    payerHistoricalAdditionalCriteria,
    pTpGrouper
  )

  // ! only quality access is source of truth
  // only deal with docs that have all required fields for this historic collection
  const onlyTreatmentPlanDocsWithOrgsMonthYear = payerHistoricalQualityAccess.filter(thing => (
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
  const uniqueOrgTpsMonthYearDocs = _.keyBy(
    onlyTreatmentPlanDocsWithOrgsMonthYear,
    pTpGrouper,
  )

  const onlyPolicyLinksWithAllFields = payerHistoricalPolicyLinks.filter(thing => (
    thing.slug
    && thing.regimen
    && thing.book
    && thing.coverage
    && thing.month
    && thing.year
  ))

  const policyLinksGroupedByTpParts = _.groupBy(
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
  for (let uniqOrgTpTimeString in uniqueOrgTpsMonthYearDocs) {
    const entryDoc = uniqueOrgTpsMonthYearDocs[uniqOrgTpTimeString]

    let additionalCriteriaDocs = !_.isEmpty(additionalCriteriaGroupedByTpParts[uniqOrgTpTimeString])
      ? additionalCriteriaGroupedByTpParts[uniqOrgTpTimeString]
      : null

    if (additionalCriteriaDocs) {
      additionalCriteriaDocs = additionalCriteriaDocs.reduce((acc, { criteria, criteriaNotes, restrictionLevel }) => {

        if (criteria) {
          const additionalCriteriaSubDoc = {
            criteria,
            criteriaNotes,
            restrictionLevel,
            // ! there are other fields in additionalCriteria subdoc in materialized payerHistoricalCombinedData as of 3/31/20 but either they:
            // ! A) are dupes of top-level fields; if they have to exist on this level in final materialized view, fine, but they shouldn't go into core
            // ! B) aren't currently used -- and aren't expected to be used -- by anything in wave-app and wave-api
            // ! C) both A and B
          }

          // ! do not persist dupe additional criteria docs
          if (
            Array.isArray(acc)
            && acc.find(docInAcc => _.isEqual(docInAcc, additionalCriteriaSubDoc))
          ) {
            return acc
          }

          acc
            ? acc.push(additionalCriteriaSubDoc)
            : acc = [additionalCriteriaSubDoc]
        }

        return acc
      }, null)
    }

    entryDoc.additionalCriteria = additionalCriteriaDocs

    const policyLinkHash = [entryDoc.slug, entryDoc.regimen, entryDoc.book, entryDoc.coverage, entryDoc.month, entryDoc.year].join('|')
    const policyLinkData = policyLinksGroupedByTpParts[policyLinkHash] || []

    const links = policyLinkData[0]
      ? {
        policyLink: policyLinkData[0].link,
        dateTracked: policyLinkData[0].dateTracked, // ? should dateTracked make it into core? not sure
        paLink: policyLinkData[0].paLink,
        project: policyLinkData[0].project,
        siteLink: policyLinkData[0].siteLink,
      }
      : null

    const hashForTps = [entryDoc.indication, entryDoc.regimen, entryDoc.line, entryDoc.population, entryDoc.book, entryDoc.coverage].join('|')

    const treatmentPlan = hashedTps[hashForTps]

    if (!treatmentPlan) continue

    const treatmentPlanId = treatmentPlan[0]
      ? treatmentPlan[0]._id
      : null

    const organization = payerOrganizationsBySlug[entryDoc.slug]

    if (!organization) continue

    const organizationId = organization
      ? organization._id
      : null

    const accessScore = accessScoresGroupedByAccess[entryDoc.access] || []

    const isoShortString = format(new Date(entryDoc.year, entryDoc.month - 1, 1), 'yyyy-MM-dd')
    // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
    const timestamp = zonedTimeToUtc(isoShortString, DEFAULT_TIMEZONE)

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
        tier: entryDoc.tier,
        tierRating: entryDoc.tierRating,
        tierTotal: entryDoc.tierTotal,
      },
      timestamp,
      project: entryDoc.project,
      policyLinkData: links,
      additionalCriteriaData: entryDoc.additionalCriteria
    }

    docs.push(doc)
  }

  await pulseCore.collection('organizations.treatmentPlans.history')
    .insertMany(docs)

  console.log('`organizations.treatmentPlans.history` seeded')
}
