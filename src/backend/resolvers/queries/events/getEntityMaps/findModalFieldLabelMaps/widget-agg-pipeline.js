module.exports = [
  {
    $unwind: {
      path: '$fields',
    },
  },
  {
    $project: {
      _id: 0,
      connectedBoIds: 1,
      key: '$fields.key',
      label: '$fields.label',
    },
  },
]
