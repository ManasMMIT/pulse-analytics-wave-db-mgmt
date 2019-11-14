const nunjucks = require('nunjucks')

const getUserPathwaysEmailData = require('./getUserPathwaysEmailData')
const sendSingleEmail = require('./sendSingleEmail')
const TEMPLATE_MAP = require('./template-map')

const PATHWAYS_ALERTS_SUB_ID = 'c89a5624-c3e1-45fd-8e7f-615256f3b2f2'

const sendToSubscribedUsers = async (
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
    const templateDetails = TEMPLATE_MAP[subscription]

    let userDataForEmails
    if (subscription === PATHWAYS_ALERTS_SUB_ID) {
      const dataPromises = usersToMock.map(user => (
        getUserPathwaysEmailData(
          user,
          subscription,
          pulseDevDb,
          date,
        )
      ))

      userDataForEmails = await Promise.all(dataPromises)
    }

    const sendMockSubEmailsPromises = []

    recipients.forEach(email => {
      userDataForEmails.forEach(({ data, client: { description } }) => {
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

module.exports = sendToSubscribedUsers
