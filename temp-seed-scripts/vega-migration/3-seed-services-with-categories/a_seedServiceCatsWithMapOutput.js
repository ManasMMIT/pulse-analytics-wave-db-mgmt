const axios = require('axios')
const { v4: uuid4 } = require('uuid')

const a_seedServiceCatsWithMapOutput = async (pulseCoreDb) => {
  const coreObmServiceCategories = await pulseCoreDb
    .collection('obms.services.categories')
    .find()
    .toArray()

  let obmServiceCatIdsMap = {}
  const ops = coreObmServiceCategories.map(({ _id, name }) => {
    const uuid = uuid4()
    obmServiceCatIdsMap[_id] = uuid

    const vegaInput = {
      id: uuid,
      name,
    }

    return axios.post('obm-service-categories/', vegaInput)
      .catch(e => { throw new Error(e) })
  })

  await Promise.all(ops)
  console.log('Obm Service Categories seeded')
  return obmServiceCatIdsMap
}

module.exports = a_seedServiceCatsWithMapOutput
