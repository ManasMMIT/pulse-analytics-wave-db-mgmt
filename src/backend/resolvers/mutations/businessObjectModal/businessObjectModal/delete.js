const { ObjectId } = require('mongodb')

const deleteBusinessObjectModal = (
  parent,
  { input: { modalId } },
  { pulseCoreDb }
) => pulseCoreDb.collection('businessObjects.modals')
    .deleteOne({ _id: ObjectId(modalId) })
    .then(({ value }) => value)

module.exports = deleteBusinessObjectModal
