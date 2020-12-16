import { MBM_TOOL_ID } from '../../../../../global-tool-ids'

const lbmOrganizations = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID, type: 'Laboratory Benefit Manager' })
    .toArray()

export default lbmOrganizations
