const { ObjectId } = require('mongodb')

const createWorkbook = (
  parent, 
  { input: { _id, ...body } }, 
  { pulseCoreDb }
) => {
  body.sheets = [
    { 
      _id: ObjectId(), 
      name: 'Default Sheet',
      fields: [
        {
          _id: ObjectId(),
          name: 'Default Field',
          type: 'string',
          oneOf: null,
        }
      ]
    }
  ]
  
  return pulseCoreDb.collection('workbooksConfig')
    .insertOne(body)
    .then(res => res.ops[0])
}

module.exports = createWorkbook
