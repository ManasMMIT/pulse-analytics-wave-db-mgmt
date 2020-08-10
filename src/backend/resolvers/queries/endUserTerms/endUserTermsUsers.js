const endUserTermsUsers = async (parent, args, { pulseProdDb }, info) => {
  return await pulseProdDb.collection('users').find().toArray()
}

module.exports = endUserTermsUsers
