const { CLIENT_A } = require('../../../../../../shared/mocks/clients')

const {
  PROVIDER_TOOL,
  PROVIDER_MANAGEMENT_DASHBOARD,
  PROVIDER_ACCOUNTS_DASHBOARD,
  PROVIDER_MANAGEMENT_SUMMARY_PAGE,
  PROVIDER_MANAGEMENT_REPORTS_PAGE,
  PROVIDER_MANAGEMENT_SUMMARY_CARD1,
  PROVIDER_MANAGEMENT_SUMMARY_CARD2,
  APM_TOOL,
} = require('../../../../../../shared/mocks/nodes')

const { USER_G, USER_H } = require('../users')

module.exports = {
  _id: 5,
  name: 'Role E',
  client: CLIENT_A,
  sitemap: {
    tools: [APM_TOOL, PROVIDER_TOOL],
    dashboards: [PROVIDER_MANAGEMENT_DASHBOARD, PROVIDER_ACCOUNTS_DASHBOARD],
    pages: [PROVIDER_MANAGEMENT_SUMMARY_PAGE, PROVIDER_MANAGEMENT_REPORTS_PAGE],
    cards: [
      PROVIDER_MANAGEMENT_SUMMARY_CARD1,
      PROVIDER_MANAGEMENT_SUMMARY_CARD2,
    ],
  },
  users: [USER_G, USER_H],
}
