const a_seedClients = require('./a_seedClients')
const b_seedTeams = require('./b_seedTeams')

module.exports = async (dbs) => {
  await a_seedClients(dbs)
  await b_seedTeams(dbs)
}
