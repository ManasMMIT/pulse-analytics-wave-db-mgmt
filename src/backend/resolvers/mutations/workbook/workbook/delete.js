const { ObjectId } = require('mongodb')

const deleteWorkbook = async (
  parent,
  { input: { _id: workbookId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(workbookId)

  const result = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndDelete({ _id })

  return result.value
}

module.exports = deleteWorkbook
