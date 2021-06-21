const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  await axios.delete('destroy-provider-data/')
  
  const pulseCoreDb = dbs.db('pulse-core')
  const coreData = await pulseCoreDb
    .collection('organizations')
    .find({ type: 'Provider' })
    .toArray()

  const errorArr = []

  for (const { _id, slug, organization, organizationTiny, state } of coreData) {
    const uuid = uuid4()

    const { id: state_id } = state ?
      await axios.get(`states/?abbreviation=${state}`)
        .then(({ data }) => data.length > 0 ? data[0] : { id: undefined }) :
          { id: undefined }

    if (state && !state_id) errorArr.push(state)

    const vegaInput = {
      id: uuid,
      slug,
      name: organization,
      name_tiny: organizationTiny,
      state_id, 
    }

    await axios.post('providers/', vegaInput)
      .catch(e => { errorArr.push(e) })

    await pulseCoreDb.collection('organizations')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo organizations-providers uuids populated + Vega providers seeded')
}
