const { ObjectId } = require('mongodb')

const CATEGORY = 'Value-Based Model Participation'
const FROM_TYPE = 'affiliated_with' // should likely be changed to `participant` or something more semantic
const TO_TYPE = 'participates_in'

const createVbmParticipant = async (
  parent,
  {
    input: {
      from, // always an APM or Pathway
      to, // always a Provider or Payer
      state,
    }
  },
  { pulseCoreDb, mongoClient },
  info,
) => {
  const { __typename, connections, ...toOrgFieldsToInclude } = to

  const organizationsCollection = pulseCoreDb.collection('organizations')

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const newConnectionId = ObjectId()

    const fromAccOp = async () => {
      const { value: finalUpdatedFrom } = await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(from._id) },
        {
          $push: {
            connections: {
              _id: newConnectionId,
              org: {
                ...toOrgFieldsToInclude,
                _id: ObjectId(to._id),
              },
              state,
              type: FROM_TYPE,
              category: CATEGORY,
            },
          },
        },
        { session, returnOriginal: false }
      )
      // returning just the FROM connections, since that's the modal the operation was fired on.
      result = finalUpdatedFrom.connections
    }

    const toAccOp = organizationsCollection.findOneAndUpdate(
      { _id: ObjectId(to._id) },
      {
        $push: {
          connections: {
            _id: newConnectionId,
            org: {
              _id: ObjectId(from._id),
              slug: from.slug,
              organization: from.organization,
              organizationTiny: from.organizationTiny,
              type: from.type,
            },
            type: TO_TYPE,
            category: CATEGORY,
            state,
          },
        },
      },
      { session, returnOriginal: false }
    )

    await Promise.all([fromAccOp(), toAccOp])
  })

  return result
}

module.exports = createVbmParticipant
