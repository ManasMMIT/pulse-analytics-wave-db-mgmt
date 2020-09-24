const upsertPathwaysAndPersonConnectionTypeDefs = require('./upsert')
const deletePathwaysAndPersonConnectionTypeDefs = require('./delete')

module.exports = [
  upsertPathwaysAndPersonConnectionTypeDefs,
  deletePathwaysAndPersonConnectionTypeDefs,
]
