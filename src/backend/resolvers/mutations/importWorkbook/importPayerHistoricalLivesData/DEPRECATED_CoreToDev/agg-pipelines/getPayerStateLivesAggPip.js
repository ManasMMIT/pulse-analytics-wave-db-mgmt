const latestTimestampAggStages = require('./latest-timestamp-agg-stages')

module.exports = (source) => [
  {
    $match: {
      source,
      territoryType: 'U.S. State',
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
        state: '$territoryName',
        month: '$dateParts.month',
        year: '$dateParts.year',
      },
      bookCoverageLivesDocs: {
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
      state: '$_id.state',
      month: '$_id.month',
      year: '$_id.year',
      bookCoverageLivesDocs: 1,
    },
  },
]
