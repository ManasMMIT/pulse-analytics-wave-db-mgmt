const { ObjectId } = require('mongodb')

module.exports = (
  parent,
  { _ids },
  { pulseCoreDb },
) => pulseCoreDb.collection('organizations.meta')
  .find({
    accountId: {
      $in: _ids.map(_id => ObjectId(_id)),
    }
  })
  .toArray()

