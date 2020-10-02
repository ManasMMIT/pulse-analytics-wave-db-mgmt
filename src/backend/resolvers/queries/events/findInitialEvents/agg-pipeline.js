module.exports = [
  {
    $addFields: {
      metaType: {
        $cond: [
          {
            $eq: ['$connectedEntities', null],
          },
          'basic',
          'relational',
        ],
      },
    },
  },
  {
    $sort: {
      timestamp: -1,
    },
  },
]
