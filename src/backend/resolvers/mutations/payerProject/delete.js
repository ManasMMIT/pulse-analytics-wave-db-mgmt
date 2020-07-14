const { ObjectId } = require('mongodb')

const deletePayerProject = async (
  parent,
  { input: { _id: projectId } },
  { pulseCoreDb, mongoClient },
  info
) => {
  const session = mongoClient.startSession()
  let result

  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb
      .collection('tdgProjects')
      .findOneAndDelete({ _id: ObjectId(projectId) }, { session })

    await pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .updateMany(
        { projectId: ObjectId(projectId) },
        { $set: { projectId: null } }
      )

    result = value
  })

  return result
}

module.exports = deletePayerProject
