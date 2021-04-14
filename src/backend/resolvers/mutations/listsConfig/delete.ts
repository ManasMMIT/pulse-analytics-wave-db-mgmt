const { ObjectId } = require('mongodb')

const deleteListsConfig = (
  parent,
  { input: { _id } },
  { pulseDevDb },
  info,
) => pulseDevDb.collection('listsConfig')
    .findOneAndDelete({ _id: ObjectId(_id) })
    .then(({ value }) => value)

export default deleteListsConfig
