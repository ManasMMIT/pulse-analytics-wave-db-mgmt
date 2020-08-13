module.exports = [
  {
    $lookup: {
      from: 'payerLatestLives',
      let: {
        slug: '$slug',
        book: '$book',
        coverage: '$coverage',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$$slug', '$slug'],
                },
                {
                  $eq: ['$$book', '$book'],
                },
                {
                  $eq: ['$$coverage', '$coverage'],
                },
                {
                  $eq: ['$source', 'DRG'],
                },
                {
                  $eq: ['$territoryType', 'National'],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'payerLatestLives.totals',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$source', 'DRG'],
                      },
                      {
                        $eq: ['$territoryType', 'National'],
                      },
                      {
                        $eq: ['$book', '$$book'],
                      },
                      {
                        $eq: ['$coverage', '$$coverage'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'totalLives',
          },
        },
        {
          $addFields: {
            totalLives: {
              $arrayElemAt: ['$totalLives.lives', 0],
            },
          },
        },
        {
          $project: {
            lives: 1,
            livesPercent: {
              $divide: ['$lives', '$totalLives'],
            },
          },
        },
      ],
      as: 'lives',
    },
  },
  {
    $addFields: {
      lives: {
        $ifNull: [
          {
            $arrayElemAt: ['$lives.lives', 0],
          },
          0,
        ],
      },
      livesPercent: {
        $ifNull: [
          {
            $arrayElemAt: ['$lives.livesPercent', 0],
          },
          0,
        ],
      },
    },
  },
  // begin data manipulation for the view after working in lives and lives percent
  {
    $group: {
      _id: {
        treatmentPlanId: '$treatmentPlanId',
        book: '$book',
        coverage: '$coverage',
        indication: '$indication',
        regimen: '$regimen',
        line: '$line',
        population: '$population',
        isRestrictive: '$isRestrictive',
        accessData: '$accessData',
      },
      // IF WE CARED ABOUT THE BREAKDOWN, LIKE ON QOA/OVERVIEW, WE'D KEEP THIS SECTION
      // payers: {
      //   $push: {
      //     tierData: '$tierData',
      //     policyLinkData: '$policyLinkData',
      //     additionalCriteriaData: '$additionalCriteriaData',
      //     slug: '$slug',
      //     organization: '$organization',
      //     orgBookCoverageIds: '$orgBookCoverageIds',
      //     lives: '$lives',
      //     livesPercent: '$livesPercent',
      //   }
      // },
      lives: {
        $sum: '$lives',
      },
      livesPercent: {
        $sum: '$livesPercent',
      },
    },
  },
  {
    $group: {
      _id: {
        isRestrictive: '$_id.isRestrictive',
        treatmentPlanId: '$_id.treatmentPlanId',
        indication: '$_id.indication',
        regimen: '$_id.regimen',
        line: '$_id.line',
        population: '$_id.population',
        book: '$_id.book',
        coverage: '$_id.coverage',
      },
      accessBuckets: {
        $push: {
          access: '$_id.accessData',
          payers: '$payers',
          lives: '$lives',
          livesPercent: '$livesPercent',
        },
      },
      lives: {
        $sum: '$lives',
      },
      livesPercent: {
        $sum: '$livesPercent',
      },
    },
  },
  // ! SORT DOES NOT HOLD AFTER DATA GOES ADDITIONAL GROUPING STAGES
  // {
  //   $sort: {
  //     '_id.accessData.sortOrder': -1,
  //   }
  // },
  {
    $group: {
      _id: {
        treatmentPlanId: '$_id.treatmentPlanId',
        indication: '$_id.indication',
        regimen: '$_id.regimen',
        line: '$_id.line',
        population: '$_id.population',
        book: '$_id.book',
        coverage: '$_id.coverage',
      },
      restrictiveBuckets: {
        $push: {
          isRestrictive: '$_id.isRestrictive',
          accessBuckets: '$accessBuckets',
          lives: '$lives',
          livesPercent: '$livesPercent',
        },
      },
      auditedLives: {
        $sum: '$lives',
      },
      auditedLivesPercent: {
        $sum: '$livesPercent',
      },
    },
  },
  {
    $project: {
      _id: '$_id.treatmentPlanId',
      indication: '$_id.indication',
      regimen: '$_id.regimen',
      line: '$_id.line',
      population: '$_id.population',
      book: '$_id.book',
      coverage: '$_id.coverage',
      restrictiveBuckets: 1,
      auditedLives: 1,
      auditedLivesPercent: 1,
    },
  },
]
