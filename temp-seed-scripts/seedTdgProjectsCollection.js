const _ = require('lodash')

const ENRICH_TP_FIELDS_PIPELINE = [
  {
    '$lookup': {
      'from': 'indications',
      'localField': 'indication',
      'foreignField': '_id',
      'as': 'indication'
    }
  }, {
    '$lookup': {
      'from': 'regimens',
      'localField': 'regimen',
      'foreignField': '_id',
      'as': 'regimen'
    }
  }, {
    '$lookup': {
      'from': 'lines',
      'localField': 'line',
      'foreignField': '_id',
      'as': 'line'
    }
  }, {
    '$lookup': {
      'from': 'populations',
      'localField': 'population',
      'foreignField': '_id',
      'as': 'population'
    }
  }, {
    '$lookup': {
      'from': 'books',
      'localField': 'book',
      'foreignField': '_id',
      'as': 'book'
    }
  }, {
    '$lookup': {
      'from': 'coverages',
      'localField': 'coverage',
      'foreignField': '_id',
      'as': 'coverage'
    }
  }, {
    '$project': {
      'indication': {
        '$arrayElemAt': [
          '$indication', 0
        ]
      },
      'regimen': {
        '$arrayElemAt': [
          '$regimen', 0
        ]
      },
      'population': {
        '$arrayElemAt': [
          '$population', 0
        ]
      },
      'line': {
        '$arrayElemAt': [
          '$line', 0
        ]
      },
      'book': {
        '$arrayElemAt': [
          '$book', 0
        ]
      },
      'coverage': {
        '$arrayElemAt': [
          '$coverage', 0
        ]
      }
    }
  }, {
    '$project': {
      'indication': '$indication.name',
      'regimen': '$regimen.name',
      'population': '$population.name',
      'line': '$line.name',
      'book': '$book.name',
      'coverage': '$coverage.name'
    }
  }
]

const beginScript = async ({
  dbs,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
}) => {
  const pulseCore = dbs.db('pulse-core');

  const organizations = await pulseCore.collection('organizations')
    .find({}).toArray()

  const orgsBySlug = _.groupBy(organizations, 'slug')

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage,
  )

  const orgTps = await pulseCore.collection('organizations.treatmentPlans')
    .find({}).toArray()

  const orgTpsByRefs = _.groupBy(
    orgTps,
    ({ organizationId, treatmentPlanId }) => organizationId + treatmentPlanId
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

  Object.keys(groupedByProject).forEach(group => {
    groupedByProject[group] = _.uniqBy(
      groupedByProject[group],
      ({ indication, regimen, line, population, book, coverage, slug }) => indication + regimen + line + population + book + coverage + slug
    )
  })

  const tdgProjectsDocOps = Object.keys(groupedByProject).map(async group => {
    const historicalDocsInGroup = groupedByProject[group]

    const getOrgTpIdsOps = historicalDocsInGroup
      .map(async ({ indication, regimen, line, population, book, coverage, slug }) => {
        const { _id: organizationId } = orgsBySlug[slug] ? orgsBySlug[slug][0] : {}

        const tpHashStr = indication + regimen + line + population + book + coverage
        const { _id: treatmentPlanId } = hashedTps[tpHashStr] ? hashedTps[tpHashStr][0] : {}

        if (!organizationId || !treatmentPlanId) return null

        const orgTp = orgTpsByRefs[organizationId.toString() + treatmentPlanId.toString()]

        let orgTpId
        if (!orgTp) {
          const { ops } = await pulseCore.collection('organizations.treatmentPlans')
            .insertOne({
              organizationId,
              treatmentPlanId,
            })

          orgTpId = ops[0]._id
        } else {
          orgTpId = orgTp[0]._id
        }

        return orgTpId
      })

    let orgTps = await Promise.all(getOrgTpIdsOps)

    orgTps = _.compact(orgTps)

    return {
      name: group,
      orgTpIds: orgTps
    }
  })

  const tdgProjects = await Promise.all(tdgProjectsDocOps)

  await pulseCore.collection('tdgProjects-2').insertMany(tdgProjects)

  console.log('`tdgProjects` collection seeded/n')
}

beginScript()
