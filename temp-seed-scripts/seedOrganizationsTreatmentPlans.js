const _ = require('lodash')

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
debugger
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


const ENRICH_TP_FIELDS_PIPELINE = [
  {
    '$lookup': {
      'from': 'indicationsFromHistoricalData',
      'localField': 'indication',
      'foreignField': '_id',
      'as': 'indication'
    }
  }, {
    '$lookup': {
      'from': 'regimensFromHistoricalData',
      'localField': 'regimen',
      'foreignField': '_id',
      'as': 'regimen'
    }
  }, {
    '$lookup': {
      'from': 'lines-2',
      'localField': 'line',
      'foreignField': '_id',
      'as': 'line'
    }
  }, {
    '$lookup': {
      'from': 'populations-2',
      'localField': 'population',
      'foreignField': '_id',
      'as': 'population'
    }
  }, {
    '$lookup': {
      'from': 'books-2',
      'localField': 'book',
      'foreignField': '_id',
      'as': 'book'
    }
  }, {
    '$lookup': {
      'from': 'coverages-2',
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
