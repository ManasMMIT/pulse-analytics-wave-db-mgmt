const { ObjectId } = require('mongodb')

const organizations = (parent, {
  toolId,
  _id,
}, { pulseCoreDb }) => {
  if (toolId) {
    return pulseCoreDb
      .collection('organizations')
      .find({ toolIds: toolId })
      .sort({ organization: 1 })
      .toArray()
  }

  if (_id) {
    return pulseCoreDb
      .collection('organizations')
      .findOne({ _id: ObjectId(_id) })
  }

  return pulseCoreDb
    .collection('organizations')
    .find()
    .sort({ organization: 1 })
    .toArray()
}

module.exports = organizations
