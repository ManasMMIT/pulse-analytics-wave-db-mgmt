const nunjucks = require('nunjucks')

const TEMPLATE_MAP = require('./template-map')
const getUserPathwaysEmailData = require('./getUserPathwaysEmailData')
const sendSingleEmail = require('./sendSingleEmail')

const sendToSubscribedUsers = async (
  parent,
  { input: { _id: subscriptionId, date } },
  { pulseDevDb, pulseCoreDb }
) => {
  const templateDetails = TEMPLATE_MAP[subscriptionId]
    || TEMPLATE_MAP['pathwaysAlerts']

  const nunjucksEnv = nunjucks.configure('src')

  const users = await pulseCoreDb.collection('users')
    .find({ 'emailSubscriptions._id': subscriptionId }).toArray()

  // the variable subscriptionId is passed to getUserPathwaysAlerts despite
  // that util being specific to pathways data crunching
  // but that's because the function is eventually going to be refactored
  // into a more general function that will route data processing
  // as needed depending on the subscriptionId
  const dataPromises = users.map(user => (
    getUserPathwaysEmailData(
      user,
      subscriptionId,
      pulseDevDb,
      date,
    )
  ))

  const usersWithEmailData = await Promise.all(dataPromises)

  const sendPromises = usersWithEmailData.map(({
    email,
    data,
    client: { description },
  }) => {
    if (data.data) {
      return sendSingleEmail({
        email,
        templateDetails,
        data,
        nunjucksEnv,
        description,
        date,
      })
    }

    return null
  })

  await Promise.all(sendPromises)

  return {
    message: 'email subscription sent',
  }
}

module.exports = sendToSubscribedUsers
