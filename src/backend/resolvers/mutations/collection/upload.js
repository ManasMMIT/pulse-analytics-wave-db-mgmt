const _ = require('lodash')
const UserInputError = require('apollo-server-express').UserInputError
const getErrorObj = require('../../../validation/getErrorObj')
const { ObjectId } = require('mongodb')
const upsertConnections = require('./upsertConnections')

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
    throw new UserInputError('Invalid rows in selected sheet', {
      error: errorObj,
    })
  }

  const targetCollection = pulseRawDb.collection(collectionName)

  // // ! HACK exception: If target is 'orgConnections', upsert into pulse-core 'organizations' collection
  // if (collectionName === 'orgConnections') {
  //   data.forEach(row => { row._id = row._id ? ObjectId(row._id) : new ObjectId() })

  //   await upsertConnections({
  //     pulseCoreDb,
  //     mongoClient,
  //     data,
  //   })

  //   return
  // }

  await targetCollection.deleteMany()
  await targetCollection.insertMany(data)

  const persistedData = await targetCollection.find().toArray()

  return persistedData
}

module.exports = uploadCollection
