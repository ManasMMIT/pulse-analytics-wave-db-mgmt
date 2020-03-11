const { ObjectId } = require('mongodb')

const updateWorkbook = async (
  parent,
  { input: { _id: workbookId, ...body } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(workbookId)

  const { value } = await pulseCoreDb
    .collection('workbooksConfig')
    .findOneAndUpdate(
      { _id },
      { $set: body },
      { returnOriginal: false },
    )

  return value
}

module.exports = updateWorkbook
