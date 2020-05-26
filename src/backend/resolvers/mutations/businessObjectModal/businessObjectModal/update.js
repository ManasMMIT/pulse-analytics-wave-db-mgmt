const { ObjectId } = require('mongodb')

const updateBusinessObjectModal = async (
  parent,
  { input: { label, modalId } },
  { pulseCoreDb }
) =>  pulseCoreDb.collection('businessObjects.modals')
  .findOneAndUpdate(
    { _id: ObjectId(modalId) },
    {
      $set: { label },
    },
    { returnOriginal: false }
  )
  .then(({ value }) => value)

module.exports = updateBusinessObjectModal
