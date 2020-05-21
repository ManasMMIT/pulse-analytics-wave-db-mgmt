const { ObjectId } = require('mongodb')

const deleteBusinessObjectModalField = async (
  parent,
  { input: { modalId, tagId, sectionId, fieldId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)
  sectionId = ObjectId(sectionId)
  fieldId = ObjectId(fieldId)

  const { value: updatedBomConfig } = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $pull: {
          'tags.$[tag].sections.$[section].fields': {
            _id: fieldId,
          }
        }
      },
      {
        arrayFilters: [
          { tag: { $exists: true }, 'tag.sections': { $exists: true }, 'tag._id': tagId },
          { 'section._id': sectionId }
        ]
      }
    )

  // ! tagId is only needed to keep this lookup N + M instead of NM
  const updatedTag = updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))

  const updatedSection = updatedTag.sections.find(({ _id }) => _id.equals(sectionId))

  return updatedSection.fields
    .find(({ _id }) => _id.equals(fieldId))
}

module.exports = deleteBusinessObjectModalField
