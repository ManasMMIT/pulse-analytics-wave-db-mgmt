module.exports = (indicationId) => [
  {
    $match: {
      _id: indicationId,
    },
  },
  {
    $lookup: {
      from: 'therapeuticAreas',
      localField: 'therapeuticAreaId',
      foreignField: '_id',
      as: 'therapeuticArea',
    },
  },
  {
    $addFields: {
      therapeuticArea: {
        $arrayElemAt: ['$therapeuticArea', 0],
      },
    },
  },
  {
    $project: {
      indication: '$name',
      therapeuticArea: '$therapeuticArea.name',
    },
  },
]
