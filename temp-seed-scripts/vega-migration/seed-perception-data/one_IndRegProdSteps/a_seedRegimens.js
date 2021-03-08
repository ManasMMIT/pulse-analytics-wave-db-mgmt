const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreRegimens = await pulseCoreDb
    .collection('regimens')
    .find()
    .toArray()

  for (const { _id, name } of coreRegimens) {
    const uuid = uuid4()

    await axios.post('regimens/', { id: uuid, name, product_set: [] })
      .catch(e => { throw new Error(e) })

    await pulseCoreDb.collection('regimens')
      .updateOne({ _id }, { $set: { uuid } })

    // ? Do I need to add uuids to indications.regimens?
    // ! come back to this Q after aligning CRUD
  }

  console.log('Mongo regimens\' uuids populated + Vega regimens seeded')
}
