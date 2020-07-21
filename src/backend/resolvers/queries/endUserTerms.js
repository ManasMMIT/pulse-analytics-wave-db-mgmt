const endUserTerms = async (parent, args, { pulseCoreDb }, info) => {
  const result = await pulseCoreDb.collection('endUserTerms').findOne()

  return result
}

module.exports = endUserTerms
