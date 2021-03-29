const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreClients = await pulseCoreDb
    .collection('clients')
    .find()
    .toArray()

  for (const { _id, name, icon } of coreClients) {
    const uuid = uuid4()

    await axios.post('clients/', { id: uuid, name, icon })
      .catch(e => { throw new Error(e) })

    await pulseCoreDb.collection('clients')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo clients\' uuids populated + Vega clients seeded')
}
