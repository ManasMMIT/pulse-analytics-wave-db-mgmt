const _ = require('lodash')
const UserInputError = require('apollo-server-express').UserInputError
const getErrorObj = require('../../../validation/getErrorObj')
const { ObjectId } = require('mongodb')
const upsertConnections = require('./upsertConnections')
const uploadScraperData = require('./uploadScraperData')

const SCRAPER_COLLECTIONS = ['merckKeytruda', 'regeneronDupixent', 'novartisKymriah']

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

  const isScraperData = SCRAPER_COLLECTIONS.includes(collectionName)
  if (isScraperData) {
    const pulseScraperDb = mongoClient.db('pulse-scraper')
    const collectionList = await pulseRawDb.listCollections({ name: collectionName }).toArray()
    const doesCollectionExist = collectionList.length > 0
    
    uploadScraperData({ 
      collectionName, 
      data, 
      doesCollectionExist,
      pulseRawDb,
      pulseScraperDb,
    })

    return
  }

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
