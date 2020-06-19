const sgClient = require('@sendgrid/client')
const _ = require('lodash')

const getEmailData = async email => {
  const uri = `to_email="${email}"`
  const encodedUri = encodeURIComponent(uri)
  const request = {
    method: 'GET',
    url: `/v3/messages?query=${encodedUri}&limit=10`,
  }
  const [res, body] = await sgClient.request(request).catch(err => {
    console.log(err)
  })
  console.log(res.headers)
  return body.messages
}

const clientMetrics = async (parent, query, { pulseCoreDb, coreUsers }) => {
  const pathwayEmailUsers = await coreUsers
    .find({ 'emailSubscriptions._id': 'c89a5624-c3e1-45fd-8e7f-615256f3b2f2' })
    .toArray()

  const usersByClient = _.groupBy(pathwayEmailUsers, 'client.name')
  sgClient.setApiKey(process.env.SENDGRID_API_KEY)

  // const currentClient = Object.keys(usersByClient)[0]
  const clientEmails = usersByClient['Exelixis'].slice(0, 2)
  const result = []
  for (let index = 0; index < clientEmails.length; index++) {
    const { email } = clientEmails[index]
    const messages = await getEmailData(email)
    result.push(messages)
  }

  return result
}

module.exports = clientMetrics
