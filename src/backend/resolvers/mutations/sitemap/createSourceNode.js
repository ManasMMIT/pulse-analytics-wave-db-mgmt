const uuid = require('uuid/v4')

const createSourceNode = (
  parent,
  { input },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb.collection('nodes').insertOne({ _id: uuid(), ...input})
    .then(res => res.ops[0])
}

module.exports = createSourceNode
