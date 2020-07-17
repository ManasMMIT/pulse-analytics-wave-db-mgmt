const createObmServiceCategory = async (
  parent,
  { input },
  { pulseCoreDb },
  info
) => {
  const { ops } = await pulseCoreDb
    .collection('obms.services.categories')
    .insertOne({ ...input })

  return ops[0]
}

module.exports = createObmServiceCategory
