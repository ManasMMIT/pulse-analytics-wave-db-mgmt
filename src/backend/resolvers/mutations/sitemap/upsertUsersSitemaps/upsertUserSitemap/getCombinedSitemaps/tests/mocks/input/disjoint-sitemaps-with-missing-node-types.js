const {
  PAYER_MANAGEMENT_SUMMARY_PAGE,
  PAYER_MANAGEMENT_DASHBOARD,
} = require('../../../../../../../shared/mocks/nodes')

module.exports = [
  {
    tools: [],
    pages: [PAYER_MANAGEMENT_SUMMARY_PAGE],
  },
  {
    dashboards: [PAYER_MANAGEMENT_DASHBOARD],
    cards: [],
  },
]
