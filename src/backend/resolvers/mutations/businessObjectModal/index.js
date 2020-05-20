const businessObjectModalResolvers = require('./businessObjectModal')
const tagResolvers = require('./tag')
const sectionResolvers = require('./section')
const fieldResolvers = require('./field')

module.exports = {
  ...businessObjectModalResolvers,
  ...tagResolvers,
  ...sectionResolvers,
  ...fieldResolvers,
}
