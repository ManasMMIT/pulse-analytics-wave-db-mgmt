// Same as wave-api's src/services/graphql/endpoints/OncologyBenefitManagers/Shared/payerPartnerLivesAggPipeline.js
// as of 12/3/20 -- only used for payer partnership template table view on Orion

const NATIONAL_LIVES_FACET_AGG = [
  {
    $match: {
      'book.isNational': true,
    },
  },
  {
    $lookup: {
      from: 'payerLatestLives',
      let: {
        slug: '$payer.slug',
        coverage: 'Medical',
        source: 'DRG',
        territoryType: 'National',
        book: '$book.name',
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
                  $eq: ['$$coverage', '$coverage'],
                },
                {
                  $eq: ['$$source', '$source'],
                },
                {
                  $eq: ['$territoryType', '$$territoryType'],
                },
                {
                  $eq: ['$$book', '$book'],
                },
              ],
            },
          },
        },
      ],
      as: 'livesData',
    },
  },
  {
    $addFields: {
      livesData: {
        $arrayElemAt: ['$livesData', 0],
      },
    },
  },
  {
    $addFields: {
      'payer.lives': '$livesData.lives',
      'payer.livesPercent': '$livesData.livesPercent',
    },
  },
  {
    $project: {
      obm: 1,
      payer: 1,
      book: '$book.name',
      isNational: '$book.isNational',
      states: '$book.states',
    },
  },
]

const STATE_LIVES_FACET_AGG = [
  {
    $match: {
      'book.isNational': false,
    },
  },
  {
    $lookup: {
      from: 'payerLatestLives',
      let: {
        slug: '$payer.slug',
        coverage: 'Medical',
        source: 'DRG',
        territoryType: 'U.S. State',
        territoryNames: '$book.states',
        book: '$book.name',
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
                  $eq: ['$$coverage', '$coverage'],
                },
                {
                  $eq: ['$$source', '$source'],
                },
                {
                  $eq: ['$$territoryType', '$territoryType'],
                },
                {
                  $in: ['$territoryName', '$$territoryNames'],
                },
                {
                  $eq: ['$$book', '$book'],
                },
              ],
            },
          },
        },
      ],
      as: 'livesDataAcrossStates',
    },
  },
  {
    $project: {
      obm: 1,
      payer: 1,
      book: 1,
      statesLivesSum: {
        $reduce: {
          input: '$livesDataAcrossStates',
          initialValue: 0,
          in: {
            $add: ['$$value', '$$this.lives'],
          },
        },
      },
    },
  },
  {
    $lookup: {
      from: 'payerLatestLives.totals',
      let: {
        coverage: 'Medical',
        source: 'DRG',
        territoryType: 'National',
        book: '$book.name',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$$coverage', '$coverage'],
                },
                {
                  $eq: ['$$source', '$source'],
                },
                {
                  $eq: ['$territoryType', '$$territoryType'],
                },
                {
                  $eq: ['$$book', '$book'],
                },
              ],
            },
          },
        },
      ],
      as: 'nationalLivesData',
    },
  },
  {
    $addFields: {
      nationalLivesData: {
        $arrayElemAt: ['$nationalLivesData', 0],
      },
    },
  },
  {
    $addFields: {
      'payer.lives': '$statesLivesSum',
      'payer.livesPercent': {
        $divide: ['$statesLivesSum', '$nationalLivesData.lives'],
      },
    },
  },
  {
    $project: {
      obm: 1,
      payer: 1,
      book: '$book.name',
      isNational: '$book.isNational',
      states: '$book.states',
    },
  },
]

module.exports = [
  {
    $unwind: {
      path: '$books',
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $project: {
      note: 1,
      payer: 1,
      obm: 1,
      book: '$books',
    },
  },
  {
    $facet: {
      nationalLivesDocs: NATIONAL_LIVES_FACET_AGG,
      stateLivesDocs: STATE_LIVES_FACET_AGG,
    },
  },
  {
    $project: {
      data: {
        $concatArrays: ['$nationalLivesDocs', '$stateLivesDocs'],
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
    $addFields: {
      'payer.lives': {
        $ifNull: ['$payer.lives', 0],
      },
      'payer.livesPercent': {
        $ifNull: ['$payer.livesPercent', 0],
      },
    },
  },
]
