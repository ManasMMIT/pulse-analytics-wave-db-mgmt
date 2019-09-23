const _ = require('lodash')
const UserInputError = require('apollo-server-express').UserInputError
const getErrorObj = require('../../../validation/getErrorObj')

const uploadCollection = async (
  parent,
  { input: { data, collectionName } },
  { pulseCoreDb, pulseRawDb },
  info
) => {
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

  await targetCollection.deleteMany()
  await targetCollection.insertMany(data)

  const persistedData = await targetCollection.find().toArray()

  return persistedData
}

module.exports = uploadCollection
