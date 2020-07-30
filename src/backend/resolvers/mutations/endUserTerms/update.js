const updateEndUserTerms = (
  parent,
  { input: { link } },
  { pulseDevDb },
  info
) => {
  return pulseDevDb
    .collection('endUserTerms')
    .findOneAndUpdate({}, { $set: { link } }, { returnOriginal: false })
    .then(({ value }) => value)
}

module.exports = updateEndUserTerms
