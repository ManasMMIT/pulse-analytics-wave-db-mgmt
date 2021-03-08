const a_seedRegimens = require('./a_seedRegimens')
const b_seedProducts = require('./b_seedProducts')
const c_seedIndications = require('./c_seedIndications')

module.exports = async (dbs) => {
  await a_seedRegimens(dbs)
  await b_seedProducts(dbs)
  await c_seedIndications(dbs)
}
