const { ObjectId } = require('mongodb')

module.exports = async (
  parent,
  { input: { action, _ids } },
  { pulseCoreDb, user },
  info,
) => {
  const actualIds = _ids.map(_id => ObjectId(_id))

  const metaDocs = []
  const upsertMetaDocs = actualIds.map(async _id => {
    const setObj = getUpdateFields(action, _id, user)

    const { value: metaDoc } = await pulseCoreDb.collection('organizations.meta')
      .findOneAndUpdate(
        {
          _id: _id
        },
        setObj,
        { upsert: true, returnOriginal: false }
      )

    metaDocs.push(metaDoc)
  })

  await Promise.all(upsertMetaDocs)

  return metaDocs
}

const getUpdateFields = (action, accountId, user) => {
  return action === 'export'
    ? {
      $set: {
        exportedAt: new Date(),
        exporter: {
          _id: user.user_id,
          name: user.username,
        },
      },
      $setOnInsert: {
        accountId: accountId,
        updatedAt: null,
        updater: null,
      }
    }
    : {
      $set: {
        updatedAt: new Date(),
        updater: {
          _id: user.user_id,
          name: user.username,
        },
      },
      $setOnInsert: {
        accountId: accountId,
        exportedAt: null,
        exporter: null,
      }
    }
}

