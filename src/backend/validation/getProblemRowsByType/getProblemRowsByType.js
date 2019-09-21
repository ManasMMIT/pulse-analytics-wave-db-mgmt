const getValidFieldsByType = require('./getValidFieldsByType')
const formatProblemRowsByType = require('./formatProblemRowsByType')

const getProblemRowsByType = async (data, core) => {
  const validFieldsByType = await getValidFieldsByType(core)

  return formatProblemRowsByType(validFieldsByType, data)
}

module.exports = getProblemRowsByType
