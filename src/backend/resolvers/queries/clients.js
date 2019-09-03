const _ = require('lodash')

const clients = async (parent, { _id }, { pulseCoreDb }) => {
  const queryObj = Boolean(_id) ? { _id } : {}
  let clients = await pulseCoreDb
    .collection('clients')
    .find(queryObj)
    .toArray()

  clients = _.sortBy(
    clients,
    ({ description }) => description.toLowerCase()
  )
  return clients
}

module.exports = clients
