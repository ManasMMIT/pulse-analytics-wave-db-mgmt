import { ObjectId } from 'mongodb'

const isValidObjectId = (value: any): boolean => {
  if (!value || typeof value === 'number') return false

  const stringValue = value.toString()
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')

  return (
    ObjectId.isValid(stringValue) &&
    new ObjectId(stringValue).equals(stringValue) &&
    checkForHexRegExp.test(stringValue)
  )
}

export default isValidObjectId
