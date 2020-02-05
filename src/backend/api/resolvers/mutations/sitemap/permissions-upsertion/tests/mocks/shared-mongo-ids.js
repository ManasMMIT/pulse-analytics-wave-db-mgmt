const { ObjectId } = require('mongodb')

const indicationId1 = ObjectId('111111111111')
const regimenId1 = ObjectId('222222222222')

const indicationId2 = ObjectId('333333333333')
const regimenId2 = ObjectId('444444444444')
const product1 = ObjectId('555555555555')

const account1 = ObjectId('666666666666')
const account2 = ObjectId('777777777777')

module.exports = {
  indicationId1,
  regimenId1,
  indicationId2,
  regimenId2,
  product1,
  account1,
  account2,
}
