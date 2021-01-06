import { ObjectId } from 'mongodb'

import cascadePolicyUpdate from '../../../../utils/cascadePolicyUpdate'
import getCascadePolicy from './getCascadePolicy'

const updateLbmOrganization = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = new ObjectId(_id)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )

    result = value

    const cascadePolicy = getCascadePolicy({
      input: result,
      pulseDevDb,
      session,
    })

    await Promise.all(cascadePolicy.map(cascadePolicyUpdate))
  })

  return result
}

export default updateLbmOrganization
