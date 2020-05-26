const { ObjectId } = require('mongodb')

const createBusinessObjectModalSection = async (
  parent,
  { input: { label, modalId, tagId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)

  const newSectionId = ObjectId()

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $push: {
          'tags.$[tag].sections': {
            _id: newSectionId,
            label,
            fields: [],
          }
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

  const updatedTag = updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))

  return updatedTag.sections.find(({ _id }) => _id.equals(newSectionId))
}

module.exports = createBusinessObjectModalSection
