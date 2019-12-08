const { ObjectId } = require('mongodb')

/*
  Right now, we're pushing an entire org with all fields
    into each connection. We should formalize what dupe fields
    we actually want to persist.
*/

const createConnection = async (
  parent,
  {
    input: {
      from,
      to,
      fromType,
      toType,
      states,
      category,
    }
  },
  { pulseCoreDb, mongoClient },
  info,
) => {
  const organizationsCollection = pulseCoreDb.collection('organizations')

  const newConnectionId = ObjectId()

  if (states.length) {
    // kick off the mass creation event on the side that needs states
  } else {
      // ! Need to somehow check to see if connection currently exists?

    const session = mongoClient.startSession()

    let result
    await session.withTransaction(async () => {
      await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(from._id), type: from.type },
        {
          $pull: {
            connections: {
              'org._id': to._id,
              type: fromType,
              category,
            }
          }
        },
        { session, returnOriginal: false }
      )

      const { value: updatedFrom } = await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(from._id), type: from.type },
        {
          $push: {
            connections: {
              _id: newConnectionId,
              org: to,
              type: fromType,
              category,
            }
          }
        },
        { session, returnOriginal: false }
      )

      await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(to._id), type: to.type },
        {
          $pull: {
            connections: {
              'org._id': from._id,
              type: toType,
              category,
            }
          }
        },
        { session, returnOriginal: false }
      )

      /* const { value: updatedTo } = */ await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(to._id), type: to.type },
        {
          $push: {
            connections: {
              _id: newConnectionId,
              org: from,
              type: toType,
              category,
            }
          }
        },
        { session, returnOriginal: false }
      )

      // returning just the from connections,
      // since that's the modal the operation was fired on.
      result = updatedFrom.connections
    })

    return result
  }
}

module.exports = createConnection
