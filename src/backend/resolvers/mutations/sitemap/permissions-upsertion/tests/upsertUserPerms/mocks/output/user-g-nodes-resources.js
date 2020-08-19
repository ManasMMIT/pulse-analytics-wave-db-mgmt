const indications = require('../input/indications')
const accounts = require('../input/accounts')

const {
  PAYER_TOOL,
  PAYER_MANAGEMENT_DASHBOARD,
  PROVIDER_TOOL,
  PROVIDER_MANAGEMENT_DASHBOARD,
} = require('../../../../../../shared/mocks/nodes')

module.exports = [
  {
    nodeId: PAYER_TOOL._id.toString(),
    accounts: [accounts[0]].map(({ _id, slug }) => ({ _id, slug })),
    regionalBreakdown: [],
    treatmentPlans: [indications[0]],
  },
  {
    nodeId: PAYER_MANAGEMENT_DASHBOARD._id.toString(),
    accounts: accounts.slice(1).map(({ _id, slug }) => ({ _id, slug })),
    regionalBreakdown: [],
    treatmentPlans: indications.slice(1),
  },
  {
    nodeId: PROVIDER_TOOL._id.toString(),
    accounts: [accounts[0]].map(({ _id, slug }) => ({ _id, slug })),
    regionalBreakdown: [],
    treatmentPlans: [indications[0]],
  },
  {
    nodeId: PROVIDER_MANAGEMENT_DASHBOARD._id.toString(),
    accounts: accounts.slice(1).map(({ _id, slug }) => ({ _id, slug })),
    regionalBreakdown: [],
    treatmentPlans: indications.slice(1),
  },
]
