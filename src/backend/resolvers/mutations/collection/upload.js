const _ = require('lodash')
const UserInputError = require('apollo-server-express').UserInputError
const getErrorObj = require('../../../validation/getErrorObj')
const { ObjectId } = require('mongodb')

const uploadCollection = async (
  parent,
  { input: { data, collectionName } },
  { pulseCoreDb, pulseRawDb },
  info
) => {
  // TODO: Move sanitization from frontend `Import.js`
  const errorObj = await getErrorObj(data, pulseCoreDb)

  const hasErrors = !_.isEmpty(errorObj)

  if (hasErrors) {
    // ? kind of the same thing as below: throw new Error(JSON.stringify(errorObj))
    throw new UserInputError(
      'Invalid rows in selected sheet',
      { error: errorObj }
    )
  }

  const targetCollection = pulseRawDb.collection(collectionName)

  if (collectionName === 'orgConnections') {
    const bulkOp = targetCollection.initializeOrderedBulkOp();

    data.forEach(({ _id, ...rest }) => {
      const targetId = _id ? ObjectId(_id) : new ObjectId()

      bulkOp.find({ _id: targetId }).upsert().updateOne({ $set: rest })
    })

    await bulkOp.execute()

    return
  }

  await targetCollection.deleteMany()
  await targetCollection.insertMany(data)

  const persistedData = await targetCollection.find().toArray()

  return persistedData
}

module.exports = uploadCollection
