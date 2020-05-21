const { ObjectId } = require('mongodb')

const deleteBusinessObjectModalSection = async (
  parent,
  { input: { modalId, tagId, sectionId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)
  sectionId = ObjectId(sectionId)

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $pull: {
          'tags.$[tag].sections': { _id: sectionId }
        }
      },
      {
        arrayFilters: [
          { 'tag._id': tagId },
        ]
      }
    )
    .then(({ value }) => value)

  const updatedTag = updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))

  return updatedTag.sections.find(({ _id }) => _id.equals(sectionId))
}

module.exports = deleteBusinessObjectModalSection
