const _ = require('lodash')
const { ObjectId } = require('mongodb')

const {
  collectionMatchMaker,
  fieldMatchMaker,
} = require('./match-makers')

const parser = require('./parser')

module.exports = pql => {
  // 1. parse string
  const parsedString = parser(pql)

  const subArrays = parsedString.map(str => str.split(' = '))

  // 2. Group by collection
  const groupedByCollection = _.groupBy(
    subArrays,
    subArr => {
      const [key] = subArr
      return collectionMatchMaker(key)
    })

  // 3. remove garbage values not caught by matchMakers
  delete groupedByCollection.null

  Object.keys(groupedByCollection)
    .forEach(collection => {
      const values = groupedByCollection[collection]

      // 3. Group each collections vals by field
      const stagedEqualityPairs = values.map(stageEqualityPair)

      groupedByCollection[collection] = [
        {
          $match: {
            $and: stagedEqualityPairs
          }
        }
      ]
    })

  return groupedByCollection
}

const stageEqualityPair = equalityPair => {
  const [key, values] = equalityPair

  let field = fieldMatchMaker(key)

  const formattedValues = values
    .split(',')
    .map(value => {
      const cleanValue = value.replace(/[\(\)]/g, '')

      return (
        field === '_id'
          ? ObjectId(cleanValue)
          : cleanValue
        )
    })

  const $in = { $in: formattedValues }

  return {
    [field]: $in
  }
}

