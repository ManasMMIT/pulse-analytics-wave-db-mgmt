module.exports = (projectPtpIds) => [
  {
    $match: {
      orgTpId: {
        $in: projectPtpIds,
      },
    },
  },
  {
    $sort: {
      timestamp: -1,
    },
  },
  {
    $addFields: {
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
        month: '$dateParts.month',
        year: '$dateParts.year',
        orgTpId: '$orgTpId',
      },
      latestForMonthYear: {
        $first: '$$ROOT',
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$latestForMonthYear',
    },
  },
  {
    $sort: {
      timestamp: -1,
    },
  },
  {
    $group: {
      _id: '$orgTpId',
      data: {
        $push: '$$ROOT',
      },
    },
  },
  {
    $project: {
      data: {
        $slice: ['$data', 6],
      },
    },
  },
  {
    $unwind: '$data',
  },
  {
    $replaceRoot: {
      newRoot: '$data',
    },
  },
  {
    $lookup: {
      from: 'treatmentPlans',
      localField: 'treatmentPlanId',
      foreignField: '_id',
      as: 'treatmentPlan',
    },
  },
  {
    $lookup: {
      from: 'indications',
      localField: 'treatmentPlan.indication',
      foreignField: '_id',
      as: 'indication',
    },
  },
  {
    $lookup: {
      from: 'regimens',
      localField: 'treatmentPlan.regimen',
      foreignField: '_id',
      as: 'regimen',
    },
  },
  {
    $lookup: {
      from: 'lines',
      localField: 'treatmentPlan.line',
      foreignField: '_id',
      as: 'line',
    },
  },
  {
    $lookup: {
      from: 'populations',
      localField: 'treatmentPlan.population',
      foreignField: '_id',
      as: 'population',
    },
  },
  {
    $lookup: {
      from: 'books',
      localField: 'treatmentPlan.book',
      foreignField: '_id',
      as: 'book',
    },
  },
  {
    $lookup: {
      from: 'coverages',
      localField: 'treatmentPlan.coverage',
      foreignField: '_id',
      as: 'coverage',
    },
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'organizationId',
      foreignField: '_id',
      as: 'organization',
    },
  },
  {
    $project: {
      timestamp: 1,
      treatmentPlanId: 1,
      orgTpId: 1,
      policyLinkData: 1,
      additionalCriteriaData: 1,
      accessData: 1,
      tierData: 1,
      organization: {
        $arrayElemAt: ['$organization', 0],
      },
      indication: {
        $arrayElemAt: ['$indication', 0],
      },
      regimen: {
        $arrayElemAt: ['$regimen', 0],
      },
      population: {
        $arrayElemAt: ['$population', 0],
      },
      line: {
        $arrayElemAt: ['$line', 0],
      },
      book: {
        $arrayElemAt: ['$book', 0],
      },
      coverage: {
        $arrayElemAt: ['$coverage', 0],
      },
      project: 1,
    },
  },
  {
    $project: {
      materializedOn: '$$NOW',
      timestamp: 1,
      treatmentPlanId: 1,
      orgTpId: 1,
      accessData: 1,
      additionalCriteriaData: 1,
      policyLinkData: 1,
      tierData: 1,
      slug: '$organization.slug',
      organization: '$organization.organization',
      organizationTiny: '$organization.organizationTiny',
      indication: '$indication.name',
      regimen: '$regimen.name',
      population: '$population.name',
      line: '$line.name',
      book: '$book.name',
      coverage: '$coverage.name',
      project: 1,
      isRestrictive: {
        $gte: ['$accessData.score', 11],
      },
      // ! following key is for joining to lives data later on in data crunching but maybe string matching is okay so avoiding this for now
      // orgBookCoverageIds: {
      //   $concat: [
      //     { $convert: { input: '$organization._id', to: 'string' } },
      //     { $convert: { input: '$book._id', to: 'string' } },
      //     { $convert: { input: '$coverage._id', to: 'string' } },
      //   ],
      // },
    },
  },
  {
    $merge: {
      into: {
        db: 'pulse-dev',
        coll: 'payerHistoricalAccess',
      },
      whenMatched: 'replace',
    },
  },
]
