const nunjucks = require('nunjucks')

const getUserEmailData = require('./getUserEmailData')
const sendSingleEmail = require('./sendSingleEmail')
const SUBSCRIPTION_MAP = require('./subscription-map')

const sendToTestGroup = async (
  parent,
  {
    input: {
      usersToMock,
      recipients,
      emailSubscriptions,
      date,
    }
  },
  { pulseDevDb }
) => {
  const nunjucksEnv = nunjucks.configure('src')

  /*
    For each subscription:
      - grab template info from template map file
      - run specific subscription filter/format func
      - For each recipient email:
        - send mock user's subscription email
  */
  emailSubscriptions.map(async subscription => {
    const { templateDetails } = SUBSCRIPTION_MAP[subscription]

    const dataPromises = usersToMock.map(user => (
      getUserEmailData(
        user,
        subscription,
        pulseDevDb,
        date,
      )
    ))

    const userDataForEmails = await Promise.all(dataPromises)

    const sendMockSubEmailsPromises = []

    recipients.forEach(email => {
      userDataForEmails.forEach(({
        data,
        client: { description }
      }) => {
        if (data.data) {
          sendMockSubEmailsPromises.push(
            sendSingleEmail({
              email,
              templateDetails,
              data,
              nunjucksEnv,
              description,
              date,
            })
          )
        }
      })
    })

    await Promise.all(sendMockSubEmailsPromises)
  })

  await Promise.all(emailSubscriptions)

  console.log(
    'All email subscriptions have been sent to test users'
  )

  return { message: 'success' }
}

module.exports = sendToTestGroup
