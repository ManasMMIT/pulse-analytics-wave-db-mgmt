const _ = require('lodash')

const getFieldBoEnumMap = async (fields, db) => {
  // STEP 1: Gather the unique business objs we need to query for.
  // It's possible for fields to be validated against diff slices of the same business object but
  // we still only need to query for that business object once.

  // Initialize the result obj and while doing the above, populate it with keys as field _ids
  // (from sheet mgmt system) and businessObjRef as values for later use. This object
  // represents the fields filtered to only include the ones who have businessObjRef.
  let fieldBoEnumMap = {}
  
  const seenBusinessObjects = {}

  const uniqueBusinessObjPromises = fields.reduce((acc, { _id: fieldId, businessObjRef }) => {
    if (businessObjRef) {
      // side op while iterating
      fieldBoEnumMap[fieldId] = businessObjRef
      
      // main op
      const { _id } = businessObjRef

      if (!seenBusinessObjects[_id]) {
        acc.push(db.collection('businessObjects').findOne({ _id }))
      } 

      seenBusinessObjects[_id] = true
    }

    return acc
  }, [])

  // STEP 2: After getting the unique business objects to query for, execute the query
  // for all of them at the same time.
  const uniqueBusinessObjs = await Promise.all(uniqueBusinessObjPromises)
  

  // STEP 3: Piggyback off the returned business objects, which have pointers to source
  // collections, and gather the promises against each bo's respective collection. Gather the
  // businessObjIds at the same time in a separate array, so we can zip up the returned data
  // with its respective business object. In a third parallel op, make a hash of business obj
  // to the _ids of all of its fields. We'll need that to secure field keys later. 
  const [
    businessObjIds,
    rawBoDataPromises,
    businessObjIdToFieldsMap,
  ] = uniqueBusinessObjs.reduce((acc, { _id, sourceCollection, fields }) => {
    const { collection, query } = sourceCollection
    acc[0].push(_id)
    acc[1].push(db.collection(collection).find(query).toArray())

    acc[2][_id] = _.keyBy(fields, '_id')

    return acc
  }, [[], [], {}])


  // STEP 4: Fire second query against data collections and zip up bo and raw data.
  const rawBoData = await Promise.all(rawBoDataPromises)
  const businessObjToCollectionMap = _.zipObject(businessObjIds, rawBoData)


  // STEP 5: Replace the businessObjRef values in the result obj with the unique
  // list of data values we've gotten. Use the two hashes from Steps 3 and 4.
  fieldBoEnumMap = _.mapValues(fieldBoEnumMap, businessObjRef => {
    const { _id, fieldId, allowBlankValues } = businessObjRef
    const rawCollectionData = businessObjToCollectionMap[_id]
    const fieldKey = businessObjIdToFieldsMap[_id][fieldId].key
    
    const uniqueValues = _.uniqBy(rawCollectionData, fieldKey).map(doc => doc[fieldKey])

    // if 'allowBlankValues' is true, add an empty string to uniqueValues
    // which is later picked up as a proxy to allow for null values
    if (allowBlankValues) uniqueValues.push('')

    return uniqueValues
  })

  return fieldBoEnumMap
}

module.exports = getFieldBoEnumMap
