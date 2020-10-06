module.exports = [
  {
    $unwind: {
      path: '$tags',
    },
  },
  {
    $replaceRoot: {
      newRoot: '$tags',
    },
  },
  {
    $unwind: {
      path: '$sections',
    },
  },
  {
    $replaceRoot: {
      newRoot: '$sections',
    },
  },
  {
    $unwind: {
      path: '$fields',
    },
  },
  {
    $replaceRoot: {
      newRoot: '$fields',
    },
  },
  {
    $lookup: {
      from: 'businessObjects',
      localField: 'boFieldId',
      foreignField: 'fields._id',
      as: 'bo',
    },
  },
  {
    $addFields: {
      boField: {
        $arrayElemAt: ['$bo', 0],
      },
    },
  },
  {
    $addFields: {
      boField: {
        $filter: {
          input: '$boField.fields',
          as: 'field',
          cond: {
            $eq: [
              {
                $toString: '$$field._id',
              },
              {
                $toString: '$boFieldId',
              },
            ],
          },
        },
      },
    },
  },
  {
    $addFields: {
      bo: {
        $arrayElemAt: ['$bo', 0],
      },
      boField: {
        $arrayElemAt: ['$boField', 0],
      },
    },
  },
  {
    $project: {
      boId: '$bo._id',
      label: 1,
      key: '$boField.key',
    },
  },
]
