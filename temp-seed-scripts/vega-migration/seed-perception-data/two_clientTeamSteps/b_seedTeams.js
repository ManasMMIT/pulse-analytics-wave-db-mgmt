const axios = require('axios')
const { v4: uuid4 } = require('uuid')
const _ = require('lodash')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreClients = await pulseCoreDb
    .collection('clients')
    .find()
    .toArray()

  const sourceClientsById = _.keyBy(coreClients, '_id')

  const coreTeams = await pulseCoreDb
    .collection('roles')
    .find()
    .toArray()

  // description is the real name of the core team. name is actually CLIENT-TEAMNAME in pulse-core.roles
  for (const { _id, description, client: { _id: clientId } } of coreTeams) {
    const uuid = uuid4()

    const { uuid: clientUuid } = sourceClientsById[clientId]

    await axios.post('teams/', { id: uuid, name: description, client: clientUuid })
      .catch(e => { throw new Error(e) })

    await pulseCoreDb.collection('roles')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo teams\' uuids populated + Vega teams seeded')
}
