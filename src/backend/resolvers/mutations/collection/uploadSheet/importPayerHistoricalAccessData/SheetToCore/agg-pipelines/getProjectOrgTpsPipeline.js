module.exports = projectId => [
  {
    $match: { _id: projectId }
  },
  {
    $lookup: {
      from: 'organizations.treatmentPlans',
      localField: 'orgTpIds',
      foreignField: '_id',
      as: 'orgTps',
    }
  }
]
