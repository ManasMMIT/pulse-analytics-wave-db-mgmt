import _ from 'lodash'

const removeTypenameFromObj = ({ __typename, ...obj }) => obj

const stripTypename = data => {
  debugger
  const isArray = Array.isArray(data)
  const isObject = _.isPlainObject(data)

  let result
  if (!isArray && !isObject) {
    result = data
  } else if (isArray) {
    result = data.map(stripTypename)
  } else { // assume if we get here, it's an object
    result = removeTypenameFromObj(data)
    result = _.mapValues(result, stripTypename)
  }

  return result
}

export default stripTypename
