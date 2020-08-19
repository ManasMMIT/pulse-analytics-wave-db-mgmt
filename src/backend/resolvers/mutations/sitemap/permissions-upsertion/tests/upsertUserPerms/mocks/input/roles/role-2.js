const { CLIENT_A } = require('../../../../../../../shared/mocks/clients')
const indications = require('../indications')
const accounts = require('../accounts')

const {
  PROVIDER_TOOL,
  PROVIDER_MANAGEMENT_DASHBOARD,
} = require('../../../../../../../shared/mocks/nodes')

const { USER_G } = require('../users')

const getRoleTreatmentPlans = require('./getRoleTreatmentPlans')

module.exports = {
  _id: 'upsertUserPerms-test-2',
  name: 'upsertUserPerms Role 2',
  client: CLIENT_A,
  resources: [
    {
      nodeId: PROVIDER_TOOL._id,
      accounts: [{ _id: accounts[0]._id }],
      treatmentPlans: getRoleTreatmentPlans([indications[0]]),
    },
    {
      nodeId: PROVIDER_MANAGEMENT_DASHBOARD._id,
      accounts: accounts.slice(1).map(({ _id }) => ({ _id })),
      treatmentPlans: getRoleTreatmentPlans(indications.slice(1)),
    },
  ],
  users: [USER_G],
}
