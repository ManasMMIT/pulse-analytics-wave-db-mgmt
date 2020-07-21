const latestTimestampAggStages = require('./latest-timestamp-agg-stages')

module.exports = (source) => [
  {
    $match: {
      source,
      territoryType: 'National',
    },
  },
  ...latestTimestampAggStages,
  {
    $lookup: {
      from: 'organizations',
      localField: 'organizationId',
      foreignField: '_id',
      as: 'org',
    },
  },
  {
    $addFields: {
      org: {
        $arrayElemAt: ['$org', 0],
      },
      dateParts: {
        $dateToParts: {
          date: '$timestamp',
        },
      },
    },
  },
  {
    $group: {
      _id: {
        slug: '$org.slug',
        organization: '$org.organization',
        organizationTiny: '$org.organizationTiny',
        month: '$dateParts.month',
        year: '$dateParts.year',
      },
      structuredLives: {
        $push: {
          book: '$book',
          coverage: '$coverage',
          lives: '$lives',
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      slug: '$_id.slug',
      organization: '$_id.organization',
      organizationTiny: '$_id.organizationTiny',
      month: '$_id.month',
      year: '$_id.year',
      structuredLives: 1,
    },
  },
]
