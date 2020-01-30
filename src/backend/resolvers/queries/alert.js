const _ = require('lodash')
const { ObjectId } = require('mongodb')

module.exports = async (
  parent,
  { _id },
  { pulseCoreDb }
) => await pulseCoreDb
  .collection('alerts')
  .findOne({
    _id: ObjectId(_id),
  })