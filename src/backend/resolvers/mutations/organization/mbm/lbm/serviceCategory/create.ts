const createLbmServiceCategory = async (
  parent,
  { input },
  { pulseCoreDb },
  info
) => {
  const { ops } = await pulseCoreDb
    .collection('lbms.services.categories')
    .insertOne({ ...input })

  return ops[0]
}

export default createLbmServiceCategory
