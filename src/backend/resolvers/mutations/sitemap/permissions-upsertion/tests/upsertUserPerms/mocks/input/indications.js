const { ObjectId } = require('mongodb')
const regimens = require('./regimens')

module.exports = [
  {
    _id: ObjectId('1111223344aa'),
    name: 'Integration test indication 1',
    regimens: [regimens[0]],
  },
  {
    _id: ObjectId('2222223344aa'),
    name: 'Integration test indication 2',
    regimens: regimens.slice(1),
  },
  {
    _id: ObjectId('3333223344aa'),
    name: 'Integration test indication 3',
    regimens: regimens.slice(2),
  },
]
