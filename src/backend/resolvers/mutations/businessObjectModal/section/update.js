const { ObjectId } = require('mongodb')

const updateBusinessObjectModalSection = async (
  parent,
  { input: { label, modalId, tagId, sectionId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)
  sectionId = ObjectId(sectionId)

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $set: {
          'tags.$[tag].sections.$[section].label': label,
        }
      },
      {
        returnOriginal: false,
        arrayFilters: [
          { 'tag._id': tagId },
          { 'section._id': sectionId },
        ]
      }
    )
    .then(({ value }) => value)

  const updatedTag = updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))

  return updatedTag.sections.find(({ _id }) => _id.equals(sectionId))
}

module.exports = updateBusinessObjectModalSection
