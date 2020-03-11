const indications =  async (parent, args, { pulseCoreDb }, info) => {
  const result = await pulseCoreDb.collection('indications')
    .find()
    .collation({ locale: 'en' })
    .sort({ name: 1 })
    .toArray()

  result.forEach(({ regimens }) => {
    regimens.sort((a, b) => a.name.localeCompare(b.name))
  })

  return result
}

module.exports = indications
