const { CLIENT_A } = require('../../../../../../shared/mocks/clients')

const {
  PATHWAYS_TOOL,
  PAYER_MANAGEMENT_DASHBOARD,
  PROVIDER_ACCOUNTS_DASHBOARD,
  PAYER_MANAGEMENT_SUMMARY_PAGE,
  PROVIDER_MANAGEMENT_REPORTS_PAGE,
  PAYER_MANAGEMENT_SUMMARY_CARD1,
  PROVIDER_MANAGEMENT_SUMMARY_CARD2,
  APM_TOOL,
} = require('../../../../../../shared/mocks/nodes')

const { USER_H } = require('../users')

module.exports = {
  _id: 6,
  name: 'Role F',
  client: CLIENT_A,
  sitemap: {
    tools: [PATHWAYS_TOOL, APM_TOOL],
    dashboards: [PAYER_MANAGEMENT_DASHBOARD, PROVIDER_ACCOUNTS_DASHBOARD],
    pages: [PAYER_MANAGEMENT_SUMMARY_PAGE, PROVIDER_MANAGEMENT_REPORTS_PAGE],
    cards: [PAYER_MANAGEMENT_SUMMARY_CARD1, PROVIDER_MANAGEMENT_SUMMARY_CARD2],
  },
  users: [USER_H],
}
