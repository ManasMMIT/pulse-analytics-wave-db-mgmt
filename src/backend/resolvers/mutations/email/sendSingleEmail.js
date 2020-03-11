const mjml2html = require('mjml')
const sgMail = require('@sendgrid/mail')
const format = require('date-fns/format')

const FROM_EMAIL = {
  email: 'alerts@pulse-tools.com',
  name: 'Pulse Alerts',
}

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

  const displayDate = format(
    new Date(`${date}-15`),  // Need to add a day to always return the correct month
    'MMM yyy'
  )

  const formattedSubject = `${emailSubject} ${displayDate} - ${description}`

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

module.exports = sendSingleEmail
