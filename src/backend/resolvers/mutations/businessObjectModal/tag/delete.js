const { ObjectId } = require('mongodb')

const deleteBusinessObjectModalTag = async (
  parent,
  { input: { modalId, tagId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $pull: { 'tags': { _id: tagId } }
      },
    )
    .then(({ value }) => value)

  return updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))
}

module.exports = deleteBusinessObjectModalTag
