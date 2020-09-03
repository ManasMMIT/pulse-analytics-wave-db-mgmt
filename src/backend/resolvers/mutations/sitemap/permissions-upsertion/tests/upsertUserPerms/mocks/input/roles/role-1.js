const { CLIENT_A } = require('../../../../../../../shared/mocks/clients')
const indications = require('../indications')
const accounts = require('../accounts')

const {
  PAYER_TOOL,
  PAYER_MANAGEMENT_DASHBOARD,
} = require('../../../../../../../shared/mocks/nodes')

const { USER_F, USER_G } = require('../users')

const getRoleTreatmentPlans = require('./getRoleTreatmentPlans')

module.exports = {
  _id: 'upsertUserPerms-test-1',
  name: 'upsertUserPerms Role 1',
  client: CLIENT_A,
  resources: [
    {
      nodeId: PAYER_TOOL._id,
      accounts: [{ _id: accounts[0]._id }],
      treatmentPlans: getRoleTreatmentPlans([indications[0]]),
    },
    {
      nodeId: PAYER_MANAGEMENT_DASHBOARD._id,
      accounts: accounts.slice(1).map(({ _id }) => ({ _id })),
      treatmentPlans: getRoleTreatmentPlans(indications.slice(1)),
    },
  ],
  users: [USER_F, USER_G],
}
