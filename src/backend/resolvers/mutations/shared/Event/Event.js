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
    // ! Never diff the immutable top-level _id
    const objWithoutTopLevelId = _.omitBy(obj, (__, key) => key === '_id')

    const flattenedObj = flatten(objWithoutTopLevelId)

    const keys = Object.keys(flattenedObj)

    const filteredKeys = keys.filter((key) => !excludedPaths.includes(key))

    return filteredKeys
  }

  getDeltas({ prev = {}, next = {}, excludedPaths = [] }) {
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

    return [
      ...commonFieldsWithChangedValues,
      ...noLongerExistingPaths,
      ...newPaths,
    ]
  }
}

module.exports = Event
