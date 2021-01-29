// import axios from 'axios'

import { MBM_TOOL_ID } from '../../../../../global-tool-ids'

const obmOrganizations = async (parent, args, { pulseCoreDb }) => {
  return pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID, type: 'Oncology Benefit Manager' })
    .toArray()

  // ! Uncomment/make real below code when obms no longer exist in mongo
  // const vegaObms = await axios.get('obms/')

  // return vegaObms.data.map(vObm => ({
  //   organization: vObm.name,
  //   organizationTiny: vObm.name_tiny,
  //   slug: vObm.slug,
  //   // ...etc.
  // }))
}

export default obmOrganizations
