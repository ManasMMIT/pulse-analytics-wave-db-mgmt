const _ = require('lodash')
const UserInputError = require('apollo-server-express').UserInputError
const getErrorObj = require('../../../validation/getErrorObj')
const { ObjectId } = require('mongodb')
const upsertConnections = require('./upsertConnections')

const uploadCollection = async (
  parent,
  { input: { data, collectionName } },
  { pulseCoreDb, pulseRawDb, mongoClient },
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
    // STEP 1: Upsert into pulse-raw 'orgConnections' collection
    // (this doesn't do anything other than make sure a queryable,
    // JSONified version of the sheet in pulse-raw is kept up to date)
    const bulkOp = targetCollection.initializeOrderedBulkOp();

    data.forEach(row => {
      row._id = row._id ? ObjectId(row._id) : new ObjectId()
      const { _id, ...rest } = row
      bulkOp.find({ _id }).upsert().updateOne({ $set: rest })
    })

    await bulkOp.execute()

    // STEP 2: Upsert into pulse-core 'organizations' collection
    await upsertConnections({
      pulseCoreDb,
      mongoClient,
      data,
    })

    return
  }

  await targetCollection.deleteMany()
  await targetCollection.insertMany(data)

  const persistedData = await targetCollection.find().toArray()

  return persistedData
}

module.exports = uploadCollection
