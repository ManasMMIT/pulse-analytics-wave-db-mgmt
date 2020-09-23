const { ObjectId } = require('mongodb')

// TOOD: Add connections from other organizations
const getAggPipeline = (personId) => [
  {
    $match: {
      personId: ObjectId(personId),
    },
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'pathwaysId',
      foreignField: '_id',
      as: 'pathwaysData',
    },
  },
  {
    $unwind: {
      path: '$pathwaysData',
    },
  },
  {
    $project: {
      _id: 1,
      organization: '$pathwaysData.organization',
      organizationType: '$pathwaysData.type',
      position: '$title',
      description: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$exclusionSettings.isExcluded', true] },
              then: '$exclusionSettings.reason',
            },
            {
              case: { $eq: ['$endDate', null] },
              then: null,
            },
          ],
          default: {
            $dateToString: {
              format: '%m-%d-%Y',
              date: '$endDate',
            },
          },
        },
      },
      status: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$exclusionSettings.isExcluded', true] },
              then: 'excluded',
            },
            { case: { $eq: ['$endDate', null] }, then: 'active' },
          ],
          default: 'outdated',
        },
      },
    },
  },
]

const personOrganizationConnections = (
  parent,
  { personId },
  { pulseCoreDb }
) => {
  return pulseCoreDb
    .collection('JOIN_pathways_people')
    .aggregate(getAggPipeline(personId))
    .toArray()
}

module.exports = personOrganizationConnections
