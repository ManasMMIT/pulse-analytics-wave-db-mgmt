const aquilaConfigTypeDefs = require('./aquilaConfig')
const aquilaConfigFieldTypeDefs = require('./field')

module.exports = [
  ...aquilaConfigTypeDefs,
  ...aquilaConfigFieldTypeDefs,
]
