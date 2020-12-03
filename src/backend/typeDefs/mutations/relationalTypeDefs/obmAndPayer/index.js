const upsertObmAndPayerConnectionTypeDefs = require('./upsert')
const deleteObmAndPayerConnectionTypeDefs = require('./delete')

module.exports = [
  upsertObmAndPayerConnectionTypeDefs,
  deleteObmAndPayerConnectionTypeDefs,
]
