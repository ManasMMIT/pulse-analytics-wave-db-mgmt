const processPathwaysAlerts = require('./processPathwaysAlerts')

const PATHWAYS_ALERTS_SUB_ID = 'c89a5624-c3e1-45fd-8e7f-615256f3b2f2'

module.exports = {
  [PATHWAYS_ALERTS_SUB_ID]: {
    templateDetails: {
      templatePath:
        'backend/resolvers/mutations/alert/mjmlTemplates/pathwaysAlerts/index.mjml',
      emailSubject: 'TDG 3rd Party Pathways Updates',
      textEmail: "It looks like your email client can't display our formatted email.\n\nTo see the latest pathways changes for the previous month, please visit www.pulse-tools.com/pathways/overview/pathways.",
      categories: ['alerts', 'pathwaysMonthlyEmail']
    },
    processAlerts: processPathwaysAlerts,
  },
}
