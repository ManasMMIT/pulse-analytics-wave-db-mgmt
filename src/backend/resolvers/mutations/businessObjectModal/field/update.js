const { ObjectId } = require('mongodb')

const updateBusinessObjectModalField = async (
  parent,
  { input: { label, modalId, tagId, sectionId, _id, inputProps, inputComponent } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)
  sectionId = ObjectId(sectionId)
  _id = ObjectId(_id)

  inputProps = JSON.parse(inputProps)

  const { value: updatedBomConfig } = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $set: {
          'tags.$[tag].sections.$[section].fields.$[field].label': label,
          'tags.$[tag].sections.$[section].fields.$[field].inputProps': inputProps,
          'tags.$[tag].sections.$[section].fields.$[field].inputComponent': inputComponent
        }
      },
      {
        returnOriginal: false,
        arrayFilters: [
          { tag: { $exists: true }, 'tag.sections': { $exists: true }, 'tag._id': tagId },
          { 'section._id': sectionId },
          { 'field._id': _id },
        ]
      }
    )

  // ! tagId is only needed to keep this lookup N + M instead of NM
  const updatedTag = updatedBomConfig.tags.find(({ _id }) => _id.equals(tagId))

  const updatedSection = updatedTag.sections.find(({ _id }) => _id.equals(sectionId))

  return updatedSection.fields
    .find(({ _id: localId }) => localId.equals(_id))
}

module.exports = updateBusinessObjectModalField
