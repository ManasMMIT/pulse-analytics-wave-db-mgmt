const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  await axios.delete('destroy-person-data/')

  const pulseCoreDb = dbs.db('pulse-core')
  const corePeople = await pulseCoreDb
    .collection('people')
    .find()
    .toArray()

  const errorArr = []

  for (const { _id, firstName, lastName, middleName } of corePeople) {
    const uuid = uuid4()

    const vegaInput = {
      id: uuid,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
    } 

    await axios.post('people/', vegaInput)
      .catch(e => { errorArr.push(e) })

    await pulseCoreDb.collection('people')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo people uuids populated + Vega people seeded')
}
