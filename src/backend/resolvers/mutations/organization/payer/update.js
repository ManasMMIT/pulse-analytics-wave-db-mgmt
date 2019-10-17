const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updatePayerOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  // cleanup body
  Object.keys(body).forEach(key => {
    // remove white spaces
    body[key] = _.trim(body[key])

    // if empty remove from object
    if (_.isEmpty(body[key])) delete body[key]
  })

  const { value: result } = await pulseCoreDb
    .collection('organizations')
    .findOneAndUpdate(
      { _id },
      { $set: body },
      { returnOriginal: false },
    )

  return result
}

module.exports = updatePayerOrganization
