const stolenZipper = require('./stolenZipper')

module.exports = pql => {
  const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')

  const innerPql = getInnerPql(pql)

  const [
    keys,
    verbs,
    values,
  ] = stolenZipper(innerPql)

  const keyConfigs = keys.reduce((acc, key, idx) => {
    const keyValues = values[idx]

    const options = keyValues.map(value => ({ label: value, value }))

    acc.push({
      businessObjectName,
      key,
      options,
    })

    return acc
  }, [])

  return keyConfigs
}

// ! stolen from aquila
const getInnerPql = pql => {
  const businessObjectWrapper = getBusinessObjectWrapper(pql)
  const businessObjectPqlWithCurlies = businessObjectWrapper.match(/\{.*?\}/g)

  return businessObjectPqlWithCurlies
    ? businessObjectPqlWithCurlies[0].slice(1, -1)
    : null
}

const getBusinessObjectWrapper = pql => {
  const businessObjectWrappers = pql.match(/[\w\s]+=\{.*?\}/g) || []
  if (!businessObjectWrappers.length) return ''

  return businessObjectWrappers[0]
}
