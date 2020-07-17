const createObmService = async (parent, { input }, { pulseCoreDb }, info) => {
  const { ops } = await pulseCoreDb
    .collection('obms.services')
    .insertOne({ ...input })

  return ops[0]
}

module.exports = createObmService
