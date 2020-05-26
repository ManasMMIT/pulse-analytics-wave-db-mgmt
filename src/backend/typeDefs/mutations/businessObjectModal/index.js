const businessObjectModalTypeDefs = require('./businessObjectModal')
const businessObjectModalTagTypeDefs = require('./tag')
const businessObjectModalSectionTypeDefs = require('./section')
const businessObjectModalFieldTypeDefs = require('./field')

module.exports = [
  ...businessObjectModalTypeDefs,
  ...businessObjectModalTagTypeDefs,
  ...businessObjectModalSectionTypeDefs,
  ...businessObjectModalFieldTypeDefs,
]
