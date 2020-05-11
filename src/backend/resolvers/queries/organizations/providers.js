const { PROVIDER_TOOL_ID } = require('../../../global-tool-ids')
const getOrgsAndConnectionsByTool = require('./getOrgsAndConnectionsByTool')

const extraProjectionFields = {
  providerCancerCenter: '$providerCancerCenter',
  state: '$state',
  city: '$city',
  oncologistsCount: '$oncologistsCount',
  sitesCount: '$sitesCount',
  groupPracticePacId: '$groupPracticePacId',
}

const providerOrganizations = async (
  parent,
  args,
  { pulseCoreDb }
) => getOrgsAndConnectionsByTool({ db: pulseCoreDb, toolId: PROVIDER_TOOL_ID, extraProjectionFields })

module.exports = providerOrganizations
