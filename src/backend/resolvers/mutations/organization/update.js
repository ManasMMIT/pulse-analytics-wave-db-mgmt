const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updateOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb, mongoClient },
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

  const session = mongoClient.startSession()

  let result

  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session },
      )

    result = value

    const { connections, ...updatedOrg } = result

    await pulseCoreDb
      .collection('organizations')
      .updateMany(
        { 'connections.org._id': _id },
        {
          $set: {
            'connections.$[el].org': updatedOrg,
          }
        },
        {
          arrayFilters: [
            { 'el.org._id': _id }
          ],
          session,
        },
      )
  })

  return result
}

module.exports = updateOrganization
