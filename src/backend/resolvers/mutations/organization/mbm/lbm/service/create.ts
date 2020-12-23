const createLbmService = async (parent, { input }, { pulseCoreDb }, info) => {
  const { ops } = await pulseCoreDb
    .collection('lbms.services')
    .insertOne({ ...input })

  return ops[0]
}

export default createLbmService
