const { ObjectId } = require('mongodb')

const createBusinessObjectModalField = async (
  parent,
  { input: { label, modalId, tagId, sectionId, fieldId, inputProps, inputComponent } }, // ? is it okay to just use closest _id in tree?
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)
  tagId = ObjectId(tagId)
  sectionId = ObjectId(sectionId)
  fieldId = ObjectId(fieldId)

  inputProps = JSON.parse(inputProps)

  const bomConfigToUpdate = await pulseCoreDb.collection('businessObjects.modals')
    .findOne({ _id: modalId })

  const currentTag = bomConfigToUpdate.tags.find(({ _id }) => _id.equals(tagId))

  const currentSection = currentTag.sections.find(({ _id }) => _id.equals(sectionId))

  const isDupeSectionField = currentSection.fields.find(({ _id }) => _id.equals(fieldId))

  if (isDupeSectionField) throw new Error('Field already in section.')

  const { value: updatedBomConfig } = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $push: {
          'tags.$[tag].sections.$[section].fields': {
            _id: fieldId,
            label,
            inputProps,
            inputComponent,
          }
        }
      },
      {
        returnOriginal: false,
        arrayFilters: [
          { tag: { $exists: true }, 'tag.sections': { $exists: true } },
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

module.exports = createBusinessObjectModalField
