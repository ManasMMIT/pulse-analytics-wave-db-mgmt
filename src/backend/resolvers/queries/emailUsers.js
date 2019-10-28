const _ = require('lodash')

const emailUsers = async (parent, args, { pulseDevDb }) => {
  
  const metaDoc = await pulseDevDb
    .collection('temp.teams')
    .find({ _id: 'meta' })
    .toArray()

  const users = Object.values(metaDoc[0]).reduce((acc, client) => {
    if (client === 'meta') return acc
    const { users } = client 
    if (!_.isEmpty(users)) acc.push(...users)
    return acc
  }, [])
  
  return users
}

module.exports = emailUsers
