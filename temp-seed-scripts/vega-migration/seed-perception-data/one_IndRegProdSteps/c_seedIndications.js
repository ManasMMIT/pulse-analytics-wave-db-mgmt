const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreIndicationsWithRegimens = await pulseCoreDb
    .collection('indications')
    .aggregate(JOIN_IND_REG_PIP)
    .toArray()

  for (const { _id, name, regimens } of coreIndicationsWithRegimens) {
    const uuid = uuid4()

    const vegaRegimensField = regimens.map(({ uuid }) => uuid) // can be empty array, which is fine

    await axios.post('indications/', { id: uuid, name, regimens: vegaRegimensField })
      .catch(e => { JSON.stringify(e.response.data) })

    await pulseCoreDb.collection('indications')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo indications\' uuids populated + Vega indications seeded w/ associated regimens')
}

const JOIN_IND_REG_PIP = [
  {
    '$unwind': {
      'path': '$regimens',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'regimens',
      'localField': 'regimens._id',
      'foreignField': '_id',
      'as': 'regimens'
    }
  }, {
    '$addFields': {
      'regimens': {
        '$arrayElemAt': [
          '$regimens', 0
        ]
      }
    }
  }, {
    '$group': {
      '_id': {
        '_id': '$_id',
        'name': '$name'
      },
      'regimens': {
        '$push': '$regimens'
      }
    }
  }, {
    '$project': {
      '_id': '$_id._id',
      'name': '$_id.name',
      'regimens': '$regimens'
    }
  }
]
