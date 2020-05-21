const { ObjectId } = require('mongodb')

const updateBusinessObjectModalTag = async (
  parent,
  { input: { label, modalId, tagId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $set: {
          'tags.$[tag].label': label,
        }
      },
      {
        returnOriginal: false,
        arrayFilters: [
          { 'tag._id': tagId }
        ]
      }
    )
    .then(({ value }) => value)

  return updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))
}

module.exports = updateBusinessObjectModalTag
