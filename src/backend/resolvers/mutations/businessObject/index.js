const businessObjectResolvers = require('./businessObject')
const businessObjectFieldResolvers = require('./field')

module.exports = {
  ...businessObjectResolvers,
  ...businessObjectFieldResolvers,
}
