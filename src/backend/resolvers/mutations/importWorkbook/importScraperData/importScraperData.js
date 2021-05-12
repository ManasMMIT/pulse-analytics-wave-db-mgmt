const _ = require('lodash')
const { ObjectId } = require('mongodb')

const getComparisonDatum = (datum) =>
  _.pick(datum, [
    'slug',
    'organization',
    'book',
    'regimenKey',
    'project',
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

const importScraperData = async ({ collection, data, pulseScraperDb }) => {
  const collectionList = await pulseScraperDb
    .listCollections({ name: collection })
    .toArray()
  const doesCollectionExist = collectionList.length > 0
  const targetCollection = pulseScraperDb.collection(collection)
  const doesIdFieldExist = Boolean(data[0]._id)

  console.log(
    `--------- Beginning uploadScraperData script for ${collection} ---------`
  )

  // Check for edge case
  if (!doesIdFieldExist && doesCollectionExist) {
    console.log(
      `--------- Collection exists but _id column is missing. Are you trying to re-import seed data? ---------`
    )
    return
  }

  // Create collection that doesn't exist from seed data file
  if (!doesIdFieldExist && !doesCollectionExist) {
    console.log(
      `--------- Collection ${collection} does not exist; creating collection ---------`
    )

    // filter row data for only relevant keys
    const filteredData = data.map(getComparisonDatum)

    // create and dump data into pulseScraper
    await targetCollection.insertMany(filteredData)

    console.log(`--------- Collection successfully created ---------`)
    return
  }

  // Update documents in collection that does exist from excel export
  if (doesIdFieldExist && doesCollectionExist) {
    console.log('--------- Adding operations to update data ---------')
    const mongoOps = []
    const collectionData = await targetCollection.find().toArray()
    const collectionById = _.keyBy(collectionData, '_id')

    data.forEach((row) => {
      const { _id } = row
      const importRowData = getComparisonDatum(row)

      // If _id field does not exist on imported row, create document
      if (!_id) {
        console.log(
          `--------- Adding operation to create new document ---------`
        )
        mongoOps.push(targetCollection.insertOne(row))

        return
      }

      // If _id field exists but doesn't match an existing document, do nothing
      if (!collectionById[_id]) {
        console.log(
          `--------- Document of _id: ${_id} does not exist in ${collection}; taking no action ---------`
        )
        return
      }

      const currentData = collectionById[_id]
      const dataToCompare = getComparisonDatum(currentData)
      const isDataEqual = _.isEqual(importRowData, dataToCompare)

      if (!isDataEqual) {
        console.log(
          `--------- Adding operation to update document of _id: ${_id} ---------`
        )
        mongoOps.push(
          targetCollection.updateOne(
            { _id: ObjectId(_id) },
            { $set: importRowData }
          )
        )
      }
    })

    console.log(
      `--------- Writing ${mongoOps.length} collection updates to mongo ---------`
    )
    await Promise.all(mongoOps)
    console.log(`--------- Collection successfully updated ---------`)
  }
}

module.exports = importScraperData
