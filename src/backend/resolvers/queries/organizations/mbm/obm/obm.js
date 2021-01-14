const { MBM_TOOL_ID } = require('../../../../../global-tool-ids')
// const axios = require('axios')

const obmOrganizations = async (parent, args, { pulseCoreDb }) => {
  // const test = await axios.get('/obms')
  // debugger

  return pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID, type: 'Oncology Benefit Manager' })
    .toArray()
}

module.exports = obmOrganizations
