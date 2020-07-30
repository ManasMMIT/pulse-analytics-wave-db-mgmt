const endUserTermsUsers = async (parent, args, { pulseDevDb }, info) => {
  return await pulseDevDb.collection('users').find().toArray()
}

module.exports = endUserTermsUsers
