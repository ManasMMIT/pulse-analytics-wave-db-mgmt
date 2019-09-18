const { ObjectId } = require('mongodb')

const updateAccount = async (
  parent,
  { type, input: { _id: stringId, ...body } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  let result
  switch (type) {
    case 'pathways':
      result = await pulseCoreDb.collection('pathways.accounts')
        .findOneAndUpdate(
          { _id },
          { $set: body },
          { returnOriginal: false },
        )
      break
    case 'payer':
      result = await pulseCoreDb.collection('payer.accounts')
        .findOneAndUpdate(
          { _id },
          { $set: body },
          { returnOriginal: false },
        )
      break
    case 'provider':
      result = await pulseCoreDb.collection('provider.accounts')
        .findOneAndUpdate(
          { _id },
          { $set: body },
          { returnOriginal: false },
        )
      break
    case 'apm':
      result = await pulseCoreDb.collection('apm.accounts')
        .findOneAndUpdate(
          { _id },
          { $set: body },
          { returnOriginal: false },
        )
      break
    default:
      throw Error(`supplied type: '${ type }' is invalid. must be one of 'pathways, payer, provider, apm'`)
  }

  return result.value
}

module.exports = updateAccount
