const { ObjectId } = require('mongodb')

const getDefaultSectionsWithId = () => [
  {
    _id: ObjectId(),
    label: 'Default Section',
    fields: [],
  }
]

const createBusinessObjectModalTag = async (
  parent,
  { input: { label, modalId } },
  { pulseCoreDb }
) => {
  modalId = ObjectId(modalId)

  const newTagId = ObjectId()

  const updatedBomConfig = await pulseCoreDb.collection('businessObjects.modals')
    .findOneAndUpdate(
      { _id: modalId },
      {
        $push: {
          'tags': {
            _id: newTagId,
            label,
            sections: getDefaultSectionsWithId(),
          }
        }
      },
      { returnOriginal: false }
    )
    .then(({ value }) => value)

  return updatedBomConfig.tags.find(({ _id }) => _id.equals(newTagId))
}

module.exports = createBusinessObjectModalTag
