const createObmServiceCategory = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('obm.services.categories')
    .insertOne({ ...input })

  return ops[0]
}

module.exports = createObmServiceCategory
