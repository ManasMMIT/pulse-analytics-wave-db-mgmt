const _ = require('lodash')

const getValidFieldsByType = require('./getValidFieldsByType')
const formatProblemRowsByType = require('./formatProblemRowsByType')

const getProblemRowsByType = async (data, core) => {
  const validFieldsByType = await getValidFieldsByType(core)

  const formattedProblemRowsByType = formatProblemRowsByType(validFieldsByType, data)
  for (const type in formattedProblemRowsByType) {
    if (_.isEmpty(formattedProblemRowsByType[type])) {
      delete formattedProblemRowsByType[type]
    }
  }

  return formattedProblemRowsByType
}

module.exports = getProblemRowsByType
