const { ObjectId } = require('mongodb')

module.exports = [
  {
    _id: ObjectId('11112c5344aa'),
    slug: 'Integration account 1',
    type: 'Payer',
  },
  {
    _id: ObjectId('11112c5344ab'),
    slug: 'Integration account 2',
    type: 'Provider',
  },
  {
    _id: ObjectId('11112c5344ac'),
    slug: 'Integration account 3',
    type: 'Alternative Payment Model',
  },
]
