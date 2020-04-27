const { ObjectId } = require('mongodb')

const DEFAULT_FIELD_VALUES = { key: '_id', type: 'string' }
const DEFAULT_QUERY = {}

const createBusinessObject = (
  parent,
  {
    input: {
      name,
      sourceCollection,
    },
  },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('businessObjects')
  .insertOne({
      name,
      sourceCollection: {
        collection: sourceCollection,
        query: DEFAULT_QUERY,
      },
      fields: [{
        _id: new ObjectId(),
        ...DEFAULT_FIELD_VALUES,
      }]
  })
  .then(({ ops }) => ops[0])

module.exports = createBusinessObject
