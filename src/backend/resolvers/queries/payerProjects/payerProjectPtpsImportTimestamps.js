const { ObjectId } = require('mongodb')

const payerProjectPtpsImportTimestamps = async (
  parent,
  { projectId },
  { pulseCoreDb }
) => {
  projectId = ObjectId(projectId)

  const aggPipeline = getAggPip(projectId)

  const results = await pulseCoreDb
    .collection('tdgProjects')
    .aggregate(aggPipeline)
    .next()

  return results
}

module.exports = payerProjectPtpsImportTimestamps

const getAggPip = projectId => [
  {
    '$match': {
      '_id': projectId
    }
  }, {
    '$unwind': {
      'path': '$orgTpIds',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'organizations.treatmentPlans.history',
      'localField': 'orgTpIds',
      'foreignField': 'orgTpId',
      'as': 'orgTpIds'
    }
  }, {
    '$project': {
      'orgTpIds': {
        '$filter': {
          'input': '$orgTpIds',
          'as': 'orgTpIdDoc',
          'cond': {
            '$eq': [
              '$$orgTpIdDoc.projectId', projectId
            ]
          }
        }
      }
    }
  }, {
    '$unwind': {
      'path': '$orgTpIds',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$project': {
      '_id': 0,
      'timestamps': '$orgTpIds.timestamp'
    }
  }, {
    '$group': {
      '_id': null,
      'timestamps': {
        '$addToSet': '$timestamps'
      }
    }
  }, {
    '$project': {
      '_id': 0
    }
  }
]
