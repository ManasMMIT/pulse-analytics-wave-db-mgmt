const { ObjectId } = require('mongodb')
const flatten = require('flat')
const _ = require('lodash')

class Event {
  constructor(metaData) {
    this.timestamp = new Date()
    this.userId = metaData.user_id // auth0 userId key is user_id
    this.username = metaData.username
    this.action = null // options: 'updated', 'created', or 'deleted'
    this.entityId = null // remains blank unless child sets
    this.businessObject = null // remains blank unless child sets
    this.connectedEntities = null // remains blank unless child sets
  }

  getFlattenedAndFilteredKeys(obj, excludedPaths) {
    const flattenedObj = flatten(obj)

    const keys = Object.keys(flattenedObj)

    const filteredKeys = keys.filter((key) => !excludedPaths.includes(key))

    return filteredKeys
  }

  stringifyObjectIds(obj) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = this.stringifyObjectIds(obj[i])
      }
    } else if (_.isPlainObject(obj)) {
      _.forEach(obj, (value, key) => {
        obj[key] = this.stringifyObjectIds(value)
      })
    } else if (
      ObjectId.isValid(obj) &&
      ObjectId(obj).equals(obj) // floats like 5.5 are valid but aren't ObjectIds
    ) {
      return obj.toString()
    }

    return obj
  }

  getDeltas({ prev = {}, next = {}, excludedPaths = [] }) {
    prev = this.stringifyObjectIds(_.cloneDeep(prev))
    next = this.stringifyObjectIds(_.cloneDeep(next))

    const prevKeys = this.getFlattenedAndFilteredKeys(prev, excludedPaths)
    const nextKeys = this.getFlattenedAndFilteredKeys(next, excludedPaths)

    const commonPaths = _.intersection(prevKeys, nextKeys)

    const commonFieldsWithChangedValues = commonPaths.reduce((acc, path) => {
      const prevValue = _.get(prev, path)
      const nextValue = _.get(next, path)

      if (!_.isEqual(prevValue, nextValue)) {
        acc.push({
          field: path,
          before: prevValue,
          after: nextValue,
        })
      }

      return acc
    }, [])

    // what paths previously existed that aren't in the incoming paths?
    const noLongerExistingPaths = _.difference(prevKeys, nextKeys).map(
      (path) => ({
        field: path,
        before: _.get(prev, path),
        after: null,
      })
    )

    // what paths are in the incoming paths that weren't there before?
    const newPaths = _.difference(nextKeys, prevKeys).map((path) => ({
      field: path,
      before: null,
      after: _.get(next, path),
    }))

    const result = [
      ...commonFieldsWithChangedValues,
      ...noLongerExistingPaths,
      ...newPaths,
    ]

    // Convert anything that's supposed to be ObjectId from
    // stringified form back to ObjectId; if it's a proper ObjectId
    // in string form, the following line returns true:
    // ! ObjectId.isValid('5f64cd51afb0b526154a3c1f') && ObjectId('5f64cd51afb0b526154a3c1f').equals('5f64cd51afb0b526154a3c1f')
    result.forEach((deltaObj) => {
      _.forEach(deltaObj, (value, key) => {
        if (ObjectId.isValid(value) && ObjectId(value).equals(value)) {
          deltaObj[key] = ObjectId(value)
        }
      })
    })

    return result
  }
}

module.exports = Event
