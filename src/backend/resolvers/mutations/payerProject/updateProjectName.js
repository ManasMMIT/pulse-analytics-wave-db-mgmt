const { ObjectId } = require('mongodb')

const updateProjectName = async (parent, { input: { name, _id } }, { pulseCoreDb }, info) => {
  const updatedOn = new Date()

  return await pulseCoreDb
    .collection('tdgProjects')
    .findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { name, updatedOn } },
      { returnOriginal: false }
    )
    .then(({ value }) => value)
}

module.exports = updateProjectName
