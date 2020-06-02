const createAquilaConfigFieldTypeDefs = require('./create')
const deleteAquilaConfigFieldTypeDefs = require('./delete')
const updateAquilaConfigFieldTypeDefs = require('./update')

module.exports = [
  deleteAquilaConfigFieldTypeDefs,
  createAquilaConfigFieldTypeDefs,
  updateAquilaConfigFieldTypeDefs,
]
