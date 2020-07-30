const endUserTermsLink = async (parent, args, { pulseDevDb }, info) => {
  return await pulseDevDb.collection('endUserTerms').findOne()
}

module.exports = endUserTermsLink
