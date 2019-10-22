const indications =  async (parent, args, { pulseCoreDb }, info) => {
  const indications = await pulseCoreDb.collection('indications')
    .find()
    .sort({ name: 1 })
    .toArray()

  indications.forEach(({ regimens }) => {
    regimens.sort((a, b) => a.name.localeCompare(b.name))
  })

  return indications
}

module.exports = indications
