const { ObjectId } = require('mongodb')

module.exports = (value) => {
  if (!value || typeof value === 'number') return false

  const stringValue = value.toString()
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')

  return (
    ObjectId.isValid(stringValue) &&
    ObjectId(stringValue).equals(stringValue) &&
    checkForHexRegExp.test(stringValue)
  )
}
