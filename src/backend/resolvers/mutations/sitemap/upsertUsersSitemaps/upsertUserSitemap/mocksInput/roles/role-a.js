const { CLIENT_A } = require('../../../../../shared/mocks/clients')

const {
  PAYER_TOOL,
  PAYER_MANAGEMENT_DASHBOARD,
  PAYER_ACCOUNTS_DASHBOARD,
  PAYER_MANAGEMENT_SUMMARY_PAGE,
  PAYER_MANAGEMENT_REPORTS_PAGE,
  PAYER_MANAGEMENT_SUMMARY_CARD1,
  PAYER_MANAGEMENT_SUMMARY_CARD2,
  PATHWAYS_TOOL,
} = require('../../../../../shared/mocks/nodes')

const { USER_A, USER_B, USER_C, USER_E } = require('../users')

module.exports = {
  _id: 1,
  name: 'Role A',
  client: CLIENT_A,
  sitemap: {
    tools: [PAYER_TOOL, PATHWAYS_TOOL],
    dashboards: [PAYER_MANAGEMENT_DASHBOARD, PAYER_ACCOUNTS_DASHBOARD],
    pages: [PAYER_MANAGEMENT_SUMMARY_PAGE, PAYER_MANAGEMENT_REPORTS_PAGE],
    cards: [PAYER_MANAGEMENT_SUMMARY_CARD1, PAYER_MANAGEMENT_SUMMARY_CARD2],
  },
  users: [USER_A, USER_B, USER_C, USER_E],
}
