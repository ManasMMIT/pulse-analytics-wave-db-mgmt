const { ObjectId } = require('mongodb')

const createAquilaConfig = async (
  parent,
  { input: { label, boId } },
  { pulseCoreDb }
) => {
  boId = ObjectId(boId)

  const isValidBoId = await pulseCoreDb.collection('businessObjects')
    .findOne({ _id: boId })

  if (!isValidBoId) throw new Error('Invalid business object id.')

  const newAquilaConfig = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .insertOne({
      label,
      boId,
      fields: [],
    })
    .then(res => res.ops[0])

  return newAquilaConfig
}

module.exports = createAquilaConfig
