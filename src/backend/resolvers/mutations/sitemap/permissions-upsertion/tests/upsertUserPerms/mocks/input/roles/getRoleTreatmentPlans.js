module.exports = (indications) => {
  return indications.map(({ _id, regimens }) => {
    const strippedRegimens = regimens.map(({ _id }) => {
      return { _id }
    })

    return {
      _id,
      regimens: strippedRegimens,
    }
  })
}
