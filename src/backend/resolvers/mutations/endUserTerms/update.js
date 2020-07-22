const updateEndUserTerms = (
  parent,
  { input: { link } },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb
    .collection('endUserTerms')
    .findOneAndUpdate({}, { $set: { link } }, { returnOriginal: false })
    .then(({ value }) => value)
}

module.exports = updateEndUserTerms
