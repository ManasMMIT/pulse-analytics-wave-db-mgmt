const payerProjectsList = async (parent, args, { pulseCoreDb }) => {
  const projectList = await pulseCoreDb
    .collection('tdgProjects')
    .aggregate([
      {
        $unwind: '$orgTpIds'
      },
      {
        $lookup: {
          from: 'organizations.treatmentPlans.history',
          localField: 'orgTpIds',
          foreignField: 'orgTpId',
          as: 'orgTpIds'
        }
      },
      {
        $project: {
          name: 1,
          timestamps: '$orgTpIds.timestamp'
        }
      },
      { $unwind: '$timestamps' },
      {
        $group: {
          _id: { _id: '$_id', name: '$name' },
          timestamps: {
            $addToSet: '$timestamps'
          }
        }
      },
      {
        $project: {
          _id: '$_id._id',
          name: '$_id.name',
          timestamps: 1
        }
      }
    ])
    .toArray()

  return projectList
}

module.exports = payerProjectsList
