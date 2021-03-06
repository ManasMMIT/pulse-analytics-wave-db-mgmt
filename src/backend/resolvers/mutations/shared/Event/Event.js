import isValidObjectId from '../../../../utils/isValidObjectId'
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

  static getFieldMetaData({ field, map }) {
    if (_.isEmpty(map)) return {}

    const isArrayField = field.match(/(.+)\.[0-9]+/)
    const actualField = isArrayField ? isArrayField[1] : field

    return map[actualField] || {}
  }

  static getRelationalFieldMetaData({ field, connectedEntities, map }) {
    if (_.isEmpty(map)) return {}

    const isArrayField = field.match(/(.+)\.[0-9]+/)
    const actualField = isArrayField ? isArrayField[1] : field

    const [first, second] = connectedEntities.map(({ boId }) => boId)

    let metaData
    if (map[first] && map[first][second]) {
      metaData = map[first][second][actualField]
    }
    if (map[second] && map[second][first]) {
      metaData = map[second][first][actualField]
    }

    return metaData || {}
  }

  getFlattenedAndFilteredKeys(obj, excludedPaths) {
    // ! filter excludedPaths keys BOTH before and after flattening
    // ! filter empty arrays, because flatten func default behavior
    const includedObjData = Object.entries(obj).reduce((acc, [key, value]) => {
      const isEmptyArray = Array.isArray(value) && _.isEmpty(value)

      // ! key during this filter is unflattened -- e.g., indications NOT indications.0
      // ! so we want to screen at this stage, as well.
      if (excludedPaths.includes(key) || isEmptyArray) return acc
      acc[key] = value
      return acc
    }, {})

    const flattenedObj = flatten(includedObjData)

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
    } else if (isValidObjectId(obj)) {
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
      const matchesArraySyntax = path.match(/(.+)\.[0-9]+/)

      if (matchesArraySyntax) {
        const [??, actualArrayPath] = matchesArraySyntax

        const entirePrevArray = _.get(prev, actualArrayPath, {})
        const entireNextArray = _.get(next, actualArrayPath, {})

        // ! if prev/next arrays are not equal, push every element array delta
        if (!_.isEqual(entirePrevArray, entireNextArray)) {
          acc.push({
            field: path,
            before: prevValue,
            after: nextValue,
          })
        }
      } else if (!_.isEqual(prevValue, nextValue)) {
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
        if (isValidObjectId(value)) {
          deltaObj[key] = ObjectId(value)
        }
      })

      // Meta data getters, below, are used to index basic, array (field names like a.0),
      // and relational delta fields to underlying business object fields and widget fields.
      // If a match is found, field meta data, as well as boId, is injected into the delta.
      if (this.entity) {
        const { fieldLabel, fieldId, boId } = this.entity.fieldMap
          ? Event.getFieldMetaData({
              field: deltaObj.field,
              map: this.entity.fieldMap,
            })
          : Event.getRelationalFieldMetaData({
              field: deltaObj.field,
              connectedEntities: this.connectedEntities,
              map: this.entity.relationalFieldMap,
            })

        deltaObj.fieldLabel = fieldLabel
        deltaObj.fieldId = fieldId
        deltaObj.boId = boId
      }
    })

    return result
  }
}

module.exports = Event
