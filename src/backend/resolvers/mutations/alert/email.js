const d3 = require('d3-collection')
const _ = require('lodash')
const mjml2html = require('mjml')
const sgMail = require('@sendgrid/mail')
const nunjucks = require('nunjucks')
const helpers = require('./mjmlTemplates/pathwaysAlerts/mockData')

const TEMPLATE_MAP = {
  pathwaysAlerts: {
    templatePath: 'backend/resolvers/mutations/alert/mjmlTemplates/pathwaysAlerts/index.mjml',
    emailSubject: 'Pathways Latest Changes',
  }
}

const FROM_EMAIL = 'claire.kim@pulsedigital.io'

const PATHWAYS_ORG_TYPE = 'Pathways'

const mjmlOptions = {
  beautify: true,
}

const sendSingleEmail = async ({ email, templateDetails, data }) => {
  const apiKey = process.env.SENDGRID_API_KEY
  sgMail.setApiKey(apiKey)
  const env = nunjucks.configure('src')
  
  const compileTemplate = ({ templatePath, data }) => {
    const result = env.render(templatePath, data)

    return result
  }

  const { templatePath, emailSubject } = templateDetails

  try {
    const mjmlString = compileTemplate({ templatePath, data })
    const htmlOutput = mjml2html(mjmlString, mjmlOptions)
    const htmlString = htmlOutput.html

    const sgData = {
      to: email,
      from: FROM_EMAIL,
      subject: emailSubject,
      text: 'text email',
      html: htmlString
    }

    const sgResponse = await sgMail.send(sgData)
      .then(() => {
        console.log('Email successfully received by server')
      })
      .catch(err => {
        console.error('Server failed to receive email')
        console.error(err)

        const { code, message } = err
        return ({
          email,
          code,
          message,
        })
      })

    return sgResponse
  } catch (err) { // only hit if template fails to compile
    const message = 'Email template failed to compile'
    console.error(message)
    console.error(err)

    return ({
      email,
      message,
    })
  }
}

const emailAlerts = async (
  parent,
  { input: {templateType} },
  { pulseDevDb },
) => {
  const templateDetails = TEMPLATE_MAP[templateType]

  const clientsWithAlerts = await pulseDevDb.collection('temp.teams').find({ _id: 'meta'}).toArray()
  delete clientsWithAlerts[0]._id // remove the _id
  
  const filterUserAlert = ({ clientTeams, organizationType, userId }) => {
    const filteredAlerts = clientTeams.reduce((acc, teamObj) => {
      const { pathwaysAlerts: pathwaysTeamAlerts } = teamObj.resources
      const teamUsersById = _.keyBy(teamObj.users, '_id')
      if (teamUsersById[userId]) return acc

      pathwaysTeamAlerts.forEach(alert => {
        const { _id, organizationType: orgType } = alert
        if (orgType && orgType !== organizationType) return acc
        if (!acc[_id]) acc[_id] = alert
      })

      return acc
    }, {})
    
    // FILTER ALERTS BY WHAT THE MOCK DATA EXPECTS HERE
    return filteredAlerts
}

  const failedEmails = []

  for (const clientArr of Object.entries(clientsWithAlerts[0])){
    const [clientName, clientUsers] = clientArr
    const clientTeams = await pulseDevDb.collection('temp.teams')
      .find({ $and: [
        { 'client.name': clientName },
        { resources: { $exists: true } },
      ]})
      .toArray()
    
    for (const user of clientUsers){
      const { _id, email } = user
      const filteredData = filterUserAlert({ clientTeams, organizationType: PATHWAYS_ORG_TYPE, userId: _id })
      const data = Object.values(filteredData)

      const status = await sendSingleEmail({ email, templateDetails, data }) // eslint-disable-line
      if (status) failedEmails.push(status)
    }
  }

  const message = failedEmails.length > 0
    ? `${ failedEmails.length } emails failed delivery to server`
    : `All emails delivered to server`

  return { message, failedEmails }
}

module.exports = emailAlerts
