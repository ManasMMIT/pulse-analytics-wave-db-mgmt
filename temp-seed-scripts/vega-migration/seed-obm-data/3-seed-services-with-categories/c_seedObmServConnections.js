const axios = require('axios')

const AGG_CONNECTIONS = [
  {
    '$lookup': {
      'from': 'organizations',
      'localField': 'obmId',
      'foreignField': '_id',
      'as': 'obm'
    }
  }, {
    '$addFields': {
      'obm': {
        '$arrayElemAt': [
          '$obm', 0
        ]
      }
    }
  }, {
    '$project': {
      'obmUuid': '$obm.uuid',
      'obmServiceOid': '$obmServiceId',
      'rating': 1
    }
  }
]

const c_seedObmServConnections = async (pulseCoreDb, obmServiceIdsMap) => {
  const aggCoreObmServiceConnects = await pulseCoreDb
    .collection('JOIN_obms_obms.services')
    .aggregate(AGG_CONNECTIONS)
    .toArray()

  const ops = aggCoreObmServiceConnects.map(({ obmUuid, obmServiceOid, rating }) => {
    const obmServiceUuid = obmServiceIdsMap[obmServiceOid]

    const vegaInput = {
      obm_id: obmUuid,
      obm_service_id: obmServiceUuid,
      rating,
    }

    return axios.post('obm-service-connections/', vegaInput)
      .catch(e => { throw new Error(e) })
  })

  await Promise.all(ops)

  console.log('Obm Service Connections seeded')
}

module.exports = c_seedObmServConnections
