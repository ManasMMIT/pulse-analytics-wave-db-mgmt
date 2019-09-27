import mjml2html from 'mjml'
import sgMail from '@sendgrid/mail'
import nunjucks from 'nunjucks'

import mockData from '../utils/mjmlTemplates/pathwaysAlerts/mockData'

const TEMPLATE_MAP = {
  pathwaysAlerts: {
    templatePath: 'services/utils/mjmlTemplates/pathwaysAlerts/index.mjml',
    emailSubject: 'Pathways Latest Changes'
  }
}

const FROM_EMAIL = 'john.kim@pulsedigital.io'

const mjmlOptions = {
  beautify: true,
}

export default class EmailAlertsController {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY
    sgMail.setApiKey(apiKey)
    this.env = nunjucks.configure('src')

    this.apiSendEmails = this.apiSendEmails.bind(this)
  }

  async sendSingleEmail({ email, templateDetails, data }) {
    const { templatePath, emailSubject } = templateDetails
    try {
      const mjmlString = await this.compileTemplate({ templatePath, data })

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

  compileTemplate({ templatePath, data }) {
    const result = this.env.render(templatePath, data)

    return result
  }

  async apiSendEmails(req, res) {
    // extract array of email addresses to use
    // will need to use emails to retreive permissioned data for each user
    // new array of shape { email: ___, data: ___ }?
    const { emailList, templateType } = req.body
    const failedEmails = []

    const templateDetails = TEMPLATE_MAP[templateType]
    const data = mockData //* for testing only

    for (const email of emailList) { // eslint-disable-line
      const status = await this.sendSingleEmail({ email, templateDetails, data }) // eslint-disable-line
      if (status) failedEmails.push(status)
    }

    if (emailList.length === failedEmails.length) {
      res.status(500).send({
        message: 'All emails failed delivery to server',
        failedEmails,
      })
      return
    }

    const message = failedEmails.length > 0
      ? `${ failedEmails.length } of ${ emailList.length } emails failed delivery to server`
      : `All ${ emailList.length } emails delivered to server`

    res.status(202).send({ message, failedEmails })
  }
}
