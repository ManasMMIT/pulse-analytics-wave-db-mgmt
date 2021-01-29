const axios = require('axios')
const { v4: uuid4 } = require('uuid')

const JOIN_CATEGORY_ID_AGG = [
  {
    '$lookup': {
      'from': 'JOIN_obms.services_obms.services.categories',
      'localField': '_id',
      'foreignField': 'obmServiceId',
      'as': 'categoryOid'
    }
  }, {
    '$addFields': {
      'categoryOid': {
        '$arrayElemAt': [
          '$categoryOid', 0
        ]
      }
    }
  }, {
    '$addFields': {
      'categoryOid': '$categoryOid.obmServiceCategoryId'
    }
  }
]

const b_seedServicesWithMapOutput = async (pulseCoreDb, obmServiceCatIdsMap) => {
  const aggCoreObmServices = await pulseCoreDb
    .collection('obms.services')
    .aggregate(JOIN_CATEGORY_ID_AGG)
    .toArray()

  let obmServiceIdsMap = {}
  const ops = aggCoreObmServices.map(async ({ _id, name, description, categoryOid }) => {

    const uuid = uuid4()
    obmServiceIdsMap[_id] = uuid

    const vegaInput = {
      id: uuid,
      name,
      description: description || '',
      category_id: obmServiceCatIdsMap[categoryOid] || null
    }

    const response = await axios.post('obm-services/', vegaInput)
      .catch(e => { throw new Error(e) })

    return response
  })

  await Promise.all(ops)

  console.log('Obm Services seeded')
  return obmServiceIdsMap
}

module.exports = b_seedServicesWithMapOutput
