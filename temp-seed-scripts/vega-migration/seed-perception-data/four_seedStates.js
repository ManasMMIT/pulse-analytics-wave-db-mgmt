const axios = require('axios')

module.exports = async (dbs) => {
  await axios.delete('destroy-state-data/')

  const pulseCoreDb = dbs.db('pulse-core')
  const coreStates = await pulseCoreDb
    .collection('usStates')
    .find()
    .toArray()

  const errorArr = []

  for (const { state, stateLong } of coreStates) {

    const vegaInput = {
      full_name: stateLong,
      abbreviation: state,
    } 

    await axios.post('states/', vegaInput)
      .catch(e => { errorArr.push(e) })
  }

  console.log('Vega states seeded')
}
