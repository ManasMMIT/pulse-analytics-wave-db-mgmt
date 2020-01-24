const _ = require('lodash')
const { ObjectId } = require('mongodb')


const getComparisonData = data =>  _.pick(data, [
  'organization',
  'regimenKey',
  'note',
  'medicalLinkType',
  'medicalLink',
  'medicalLinkNote',
  'pharmacyLinkType',
  'pharmacyLink',
  'pharmacyLinkNote',
  'formularyLinkType',
  'formularyLinkNote',
  'paFormLinkType',
  'paFormLink',
]) 


const uploadScraperData = async ({
  collectionName,
  data,
  doesCollectionExist,
  pulseRawDb,
  pulseScraperDb,
}) => {
  const targetCollection = pulseScraperDb.collection(collectionName)

  const idFieldExists = Boolean(data[0]._id)

  console.log(`--------- Beginning uploadScraperData script for ${collectionName} ---------`)
  
  // Check for edge case
  if (!idFieldExists && doesCollectionExist) {
    console.log(`--------- Collection exists but _id column is missing. Are you trying to re-import seed data? ---------`)
    return
  }

  // Create collection that doesn't exist from seed data file
  if (!idFieldExists && !doesCollectionExist) {
    console.log(`--------- Collection ${collectionName} does not exist; creating collection ---------`)
    
    // create dummy collection in pulseRaw
    await pulseRawDb.createCollection(collectionName)

    // create and dump data into pulseScraper 
    await targetCollection.deleteMany()
    await targetCollection.insertMany(data)
    
    console.log(`--------- Collection successfully created ---------`)
    return
  }

  // Update documents in collection that does exist from excel export
  if (idFieldExists && doesCollectionExist) {
    console.log('--------- Adding operations to update data ---------')
    const mongoOps = []
    const collectionData = await targetCollection.find().toArray()
    const collectionById = _.keyBy(collectionData, '_id')

    data.forEach(row => {
      const { _id } = row
      const importRowData = getComparisonData(row)

      // If _id field does not exist on imported row, create document
      if (!_id) {
        console.log(`--------- Adding operation to create new document ---------`)
        mongoOps.push(targetCollection.insertOne(row))

        return
      }
      
      // If _id field exists but doesn't match an existing document, do nothing
      if (!collectionById[_id]) {
        console.log(`--------- Document of _id: ${_id} does not exist in ${collectionName}; taking no action ---------`)
        return
      }

      const currentData = collectionById[_id]
      const dataToCompare = getComparisonData(currentData)

      const isDataEqual = _.isEqual(importRowData, dataToCompare)

      if (!isDataEqual) {
        console.log(`--------- Adding operation to update document of _id: ${_id} ---------`)
        mongoOps.push(
          targetCollection.updateOne({ _id: ObjectId(_id) }, { $set: importRowData })
        )
      }
    })
    
    console.log(`--------- Writing ${mongoOps.length} collection updates to mongo ---------`)
    await Promise.all(mongoOps)
    console.log(`--------- Collection successfully updated ---------`)
  }

  return
}

module.exports = uploadScraperData