const { ObjectId } = require('mongodb')
const _ = require('lodash')

module.exports = (
  parent,
  {
    input: {
      projectId,
      limit,
      skip,
      order,
    }
  },
  { pulseCoreDb }
) => {
  const aggPipeline = getAggPipeline({
    projectId,
    limit,
    skip,
    order,
  })

  return pulseCoreDb.collection('tdgProjects')
    .aggregate(aggPipeline)
    .toArray()
}

const getAggPipeline = ({
  projectId,
  limit,
  skip,
  order,
}) => {
  const matchStage = projectId
    ? { '$match': { '_id': ObjectId(projectId) } }
    : null

  const skipStage = skip && !matchStage
    ? { '$skip': skip }
    : null

  const limitStage = limit
    ? { '$limit': limit }
    : null

  const sortStage = (order && order.length)
    ? { '$sort': getSortObjFromConfig(order) }
    : null

  const aggPipeline = [
    matchStage,
    {
      '$lookup': {
        'from': 'organizations.treatmentPlans',
        'localField': 'orgTpIds',
        'foreignField': '_id',
        'as': 'orgTps'
      }
    }, {
      '$unwind': {
        'path': '$orgTps'
      }
    },
    {
      '$addFields': {
        'orgTps.project': {
          '_id': '$_id',
          'name': '$name'
        }
      }
    },
    {
      '$replaceRoot': {
        'newRoot': '$orgTps'
      }
    }, {
      '$lookup': {
        'from': 'treatmentPlans',
        'localField': 'treatmentPlanId',
        'foreignField': '_id',
        'as': 'treatmentPlan'
      }
    }, {
      '$lookup': {
        'from': 'indications',
        'localField': 'treatmentPlan.indication',
        'foreignField': '_id',
        'as': 'indication'
      }
    }, {
      '$lookup': {
        'from': 'regimens',
        'localField': 'treatmentPlan.regimen',
        'foreignField': '_id',
        'as': 'regimen'
      }
    }, {
      '$lookup': {
        'from': 'lines',
        'localField': 'treatmentPlan.line',
        'foreignField': '_id',
        'as': 'line'
      }
    }, {
      '$lookup': {
        'from': 'populations',
        'localField': 'treatmentPlan.population',
        'foreignField': '_id',
        'as': 'population'
      }
    }, {
      '$lookup': {
        'from': 'books',
        'localField': 'treatmentPlan.book',
        'foreignField': '_id',
        'as': 'book'
      }
    }, {
      '$lookup': {
        'from': 'coverages',
        'localField': 'treatmentPlan.coverage',
        'foreignField': '_id',
        'as': 'coverage'
      }
    }, {
      '$lookup': {
        'from': 'organizations',
        'localField': 'organizationId',
        'foreignField': '_id',
        'as': 'organization'
      }
    }, {
      '$project': {
        'organization': {
          '$arrayElemAt': [
            '$organization', 0
          ]
        },
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
        },
        'project': 1
      }
    }, {
      '$project': {
        'slug': '$organization.slug',
        'organization': '$organization.organization',
        'indication': '$indication.name',
        'regimen': '$regimen.name',
        'population': '$population.name',
        'line': '$line.name',
        'book': '$book.name',
        'coverage': '$coverage.name',
        'project': 1
      }
    },
    // ! unfortunately, need to sort first, then skip and limit, so that we can accurately return subset
    sortStage, // TODO: Make sort case-insensitive
    skipStage,
    limitStage,
  ]

  const compactedAggPipeline = _.compact(aggPipeline)

  return compactedAggPipeline
}

const getSortObjFromConfig = orderConfig => orderConfig
  .reduce((acc, { key, direction }) => {
    acc[key] = direction

    return acc
  }, {})
