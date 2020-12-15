import { MBM_TOOL_ID } from '../../../../global-tool-ids'

const mbmOrganizations = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID })
    .toArray()

export default mbmOrganizations
