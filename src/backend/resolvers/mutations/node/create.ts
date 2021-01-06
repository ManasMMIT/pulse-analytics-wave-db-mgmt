import uuid from 'uuid/v4'

const createNode = (
  parent,
  { input },
  { pulseCoreDb },
  info
) => pulseCoreDb
  .collection('nodes')
  .insertOne({ _id: uuid(), ...input})
  .then(res => res.ops[0])

export default createNode
