import EmailAlertsController from './emailAlerts.controller'

export default function() {
  const app = this

  const emailAlertsCtrl = new EmailAlertsController()

  app.post('/email-alerts', emailAlertsCtrl.apiSendEmails)
}
