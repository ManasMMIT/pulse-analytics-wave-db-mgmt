const businessObjectTypeDefs = require('./businessObject')
const businessObjectFieldTypeDefs = require('./field')

module.exports = [
  ...businessObjectTypeDefs,
  ...businessObjectFieldTypeDefs,
]
