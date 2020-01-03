const { ObjectId } = require('mongodb')

// ! same logic as `createVbmParticipant, but `from` and `to` are switched

const CATEGORY = 'Value-Based Model Participation'
const FROM_TYPE = 'participates_in'
const TO_TYPE = 'affiliated_with' // should likely be changed to `participant` or something more semantic

const createVbmParticipation = async (
  parent,
  {
    input: {
      from, // always a Provider or Payer
      to, // always an APM or Pathway
      state,
    }
  },
  { pulseCoreDb, mongoClient },
  info,
) => {
  const { __typename, connections, ...fromOrgFieldsToInclude } = from

  const organizationsCollection = pulseCoreDb.collection('organizations')

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const newConnectionId = ObjectId()

    const toAccOp = organizationsCollection.findOneAndUpdate(
      { _id: ObjectId(to._id) },
      {
        $push: {
          connections: {
            _id: newConnectionId,
            org: {
              ...fromOrgFieldsToInclude,
              _id: ObjectId(from._id),
            },
            state,
            type: TO_TYPE,
            category: CATEGORY,
          }
        }
      },
      { session, returnOriginal: false }
    )

    const fromAccOp = async () => {
      const { value } = await organizationsCollection.findOneAndUpdate(
        { _id: ObjectId(from._id) },
        {
          $push: {
            connections: {
              _id: newConnectionId,
              org: {
                _id: ObjectId(to._id),
                slug: to.slug,
                organization: to.organization,
                organizationTiny: to.organizationTiny,
                type: to.type,
              },
              type: FROM_TYPE,
              category: CATEGORY,
              state,
            }
          }
        },
        { session, returnOriginal: false }
      )

      // returning just the FROM connections, since that's the modal the operation was fired on.
      result = value.connections
    }

    await Promise.all([toAccOp, fromAccOp()])
  })

  return result
}

module.exports = createVbmParticipation
