const _ = require('lodash')
const mjml2html = require('mjml')
const sgMail = require('@sendgrid/mail')
const nunjucks = require('nunjucks')
const mockData = require('./mjmlTemplates/pathwaysAlerts/mockData')

const TEMPLATE_MAP = {
  pathwaysAlerts: {
    templatePath: 'services/utils/mjmlTemplates/pathwaysAlerts/index.mjml',
    emailSubject: 'Pathways Latest Changes'
  }
}

const FROM_EMAIL = 'claire.kim@pulsedigital.io'

const mjmlOptions = {
  beautify: true,
}

const emailAlerts = async (
  parent,
  { input: { templateType, emailList } },
  { pulseDevDb },
) => {
  debugger 
  const apiKey = process.env.SENDGRID_API_KEY
  sgMail.setApiKey(apiKey)
  const env = nunjucks.configure('src')

  const sendSingleEmail = async ({ email, templateDetails, data }) => {
    const { templatePath, emailSubject } = templateDetails
    try {
      const mjmlString = await compileTemplate({ templatePath, data })

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

  const compileTemplate = ({ templatePath, data }) => {
    const result = env.render(templatePath, data)

    return result
  }

  const failedEmails = []

  const templateDetails = TEMPLATE_MAP[templateType]
  const data = mockData //* for testing only

  for (const email of emailList) { // eslint-disable-line
    const status = await sendSingleEmail({ email, templateDetails, data }) // eslint-disable-line
    if (status) failedEmails.push(status)
  }

  if (emailList.length === failedEmails.length) {
    throw new Error('All emails failed delivery to server')
  }

  const message = failedEmails.length > 0
    ? `${ failedEmails.length } of ${ emailList.length } emails failed delivery to server`
    : `All ${ emailList.length } emails delivered to server`

  return { message, failedEmails }
}

module.exports = emailAlerts
