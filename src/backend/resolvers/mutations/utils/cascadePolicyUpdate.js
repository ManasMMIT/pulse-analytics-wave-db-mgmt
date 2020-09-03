const _ = require('lodash')

module.exports = async ({
  input, // ! hopefully the result of the non-cascading update op
  into: { db, coll, options = {}, findObj = {} },
  fieldMap,
}) => {
  const setObj = getSetObj(input, fieldMap)

  return db.collection(coll).updateMany(findObj, setObj, options)
}

const getSetObj = (input, fieldMap) => {
  return fieldMap.reduce(
    (setObj, map) => {
      if (typeof map === 'string') {
        setObj.$set[map] = _.get(input, map)
      } else {
        const { foreignField, localField } = map
        setObj.$set[foreignField] = _.get(input, localField)
      }

      return setObj
    },
    { $set: {} }
  )
}
