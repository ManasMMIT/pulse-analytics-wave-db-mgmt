const aquilaConfigResolvers = require('./aquilaConfig')
const fieldResolvers = require('./field')

module.exports = {
  ...aquilaConfigResolvers,
  ...fieldResolvers,
}
