const d3 = require('d3-collection')
const _ = require('lodash')
const mjml2html = require('mjml')
const sgMail = require('@sendgrid/mail')
const nunjucks = require('nunjucks')
const format = require('date-fns/format')
const utils = require('./mjmlTemplates/pathwaysAlerts/utils')

const TEMPLATE_MAP = {
  pathwaysAlerts: {
    templatePath:
      'backend/resolvers/mutations/alert/mjmlTemplates/pathwaysAlerts/index.mjml',
    emailSubject: 'TDG 3rd Party Pathways Updates',
    textEmail: "It looks like your email client can't display our formatted email.\n\nTo see the latest pathways changes for the previous month, please visit www.pulse-tools.com/pathways/overview/pathways.",
    categories: ['alerts', 'pathwaysMonthlyEmail']
  },
}

const FROM_EMAIL = {
  email: 'alerts@pulse-tools.com',
  name: 'Pulse Alerts',
}

const PATHWAYS_ORG_TYPE = 'Pathways'

const mjmlOptions = {
  minify: true,
}

const sendSingleEmail = async ({
  email,
  templateDetails,
  data,
  nunjucksEnv,
  description,
  date,
}) => {
  const apiKey = process.env.SENDGRID_API_KEY
  sgMail.setApiKey(apiKey)

  const compileTemplate = ({ templatePath, data }) => {
    const result = nunjucksEnv.render(templatePath, data)
    return result
  }

  const {
    templatePath,
    emailSubject,
    textEmail,
    categories,
  } = templateDetails
  
  const displayDate = format( new Date(`${ date }-15`), 'MMM yyy') // Need to add a day to always return the correct month
  const formattedSubject = `${ emailSubject } ${ displayDate } - ${ description }`

  try {
    const mjmlString = compileTemplate({ templatePath, data })
    const htmlOutput = mjml2html(mjmlString, mjmlOptions)
    const htmlString = htmlOutput.html

    const sgData = {
      to: email,
      from: FROM_EMAIL,
      subject: formattedSubject,
      text: textEmail,
      html: htmlString,
      categories,
    }

    const sgResponse = await sgMail
      .send(sgData)
      .then(() => {
        console.log(`Email to '${email}' successfully received by server`)
      })
      .catch(err => {
        console.error(`Server failed to receive email to ${email}`)
        console.error(err)

        const { code, message } = err
        return {
          email,
          code,
          message,
        }
      })

    return sgResponse
  } catch (err) { // only hit if template fails to compile
    const message = 'Email template failed to compile'
    console.error(message)
    console.error(err)

    return {
      email,
      message,
    }
  }
}

const filterUserAlert = ({
  clientTeams,
  organizationType,
  userId,
  emailDate: { year, month }
}) => {
  const filteredAlerts = clientTeams.reduce((acc, teamObj) => {
    const { pathwaysAlerts: pathwaysTeamAlerts } = teamObj.resources

    pathwaysTeamAlerts.forEach(alert => {
      const { _id, organizationType: orgType, alertDate } = alert
      const [alertYear, alertMonth] = alertDate.split('-')

      if (!(alertYear === year && alertMonth === month)) return acc
      if (orgType && orgType !== organizationType) return acc
      if (!acc[_id]) acc[_id] = alert
    })

    return acc
  }, {})

  // Sort at organization level by oncologistPercent
  const sortedAlerts = Object.values(filteredAlerts).sort(
    (a, b) => b.oncologistPercent - a.oncologistPercent
  )
  const dateSort = (a, b) =>
    new Date(b.alertDate).valueOf() - new Date(a.alertDate).valueOf()

  const formattedAlerts = d3
    .nest()
    .key(d => d.organization)
    .key(d => _.camelCase(d.superAlertType))
    .sortValues(dateSort)
    .rollup(arr => {
      const { superAlertType } = arr[0]
      const isPositioning = superAlertType === 'Positioning'

      if (!isPositioning) return arr

      // Additional group and sort by 'indication' for Positioning alerts only
      const sortedData = _.sortBy(arr, ['indication'])
      return _.groupBy(sortedData, 'indication')
    })
    .object(sortedAlerts)

  return formattedAlerts
}
 
const emailAlerts = async (
  parent,
  { input: { templateType, date } },
  { pulseDevDb }
) => {
  const templateDetails =
    TEMPLATE_MAP[templateType] || TEMPLATE_MAP['pathwaysAlerts']
  const nunjucksEnv = nunjucks.configure('src')

  let clientsWithAlerts = await pulseDevDb
    .collection('temp.teams')
    .find({ _id: 'meta' })
    .toArray()
  delete clientsWithAlerts[0]._id // remove the _id
  
  const failedEmails = []
  const emailsList = []

  const [year, month] = date.split('-')
  const emailDate = { year, month }

  for (const clientArr of Object.entries(clientsWithAlerts[0])) {
    const [clientName, clientUsers] = clientArr
    let users = clientUsers.users
    const { description } = clientUsers
    const clientTeams = await pulseDevDb
      .collection('temp.teams')
      .find({
        $and: [{ 'client.name': clientName }, { resources: { $exists: true } }],
      })
      .toArray()

    if (templateType !== 'pathwaysAlerts') {
      users = users.filter(user => user[templateType])
    }
    
    for (const user of users) {
      const { _id, email } = user
      emailsList.push(email)

      const filteredData = filterUserAlert({
        clientTeams,
        organizationType: PATHWAYS_ORG_TYPE,
        userId: _id,
        emailDate,
      })

      const data = { 
        ...utils,
        data: filteredData,
        emailDate,
      }

      if (filteredData) {
        const status = await sendSingleEmail({
          email,
          templateDetails,
          data,
          nunjucksEnv,
          description,
          date,
        })
        if (status) failedEmails.push(status)
      }
    }
  }

  const failedEmailLength = failedEmails.length
  const emailListLength = emailsList.length

  if (emailListLength === failedEmailLength) {
    throw new Error('All emails failed delivery to server')
  }

  const message =
    failedEmailLength > 0
      ? `${failedEmailLength} of ${emailListLength} emails failed delivery to server`
      : `All ${emailListLength} emails delivered to server`

  console.log('-----------')
  console.log(message)
}

module.exports = emailAlerts
