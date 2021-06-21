const axios = require('axios')
const { v4: uuid } = require('uuid')

const {
  PROVIDER_TOOL_ID,
  IMMUNO_TOOL_ID,
  SICKLE_TOOL_ID,
} = require('./../../../../global-tool-ids')

const createProviderOrganization = async (
  parent,
  { input },
  { pulseCoreDb },
  info
) => {
  // ! Vega Op
  const providerUuid = uuid()

  const { id: state_id } = input.state
    ? await axios
        .get(`states/?abbreviation=${input.state}`)
        .then(({ data }) => (data.length > 0 ? data[0] : { id: null }))
        .catch((e) => {
          throw new Error(JSON.stringify(e.response.data))
        })
    : { id: null }

  await axios
    .post('providers/', {
      id: providerUuid,
      slug: input.slug,
      name: input.organization,
      name_tiny: input.organizationTiny,
      state_id,
    })
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  input.uuid = providerUuid

  // ! Mongo Op
  const { ops } = await pulseCoreDb.collection('organizations').insertOne({
    ...input,
    type: 'Provider',
    toolIds: [PROVIDER_TOOL_ID, IMMUNO_TOOL_ID, SICKLE_TOOL_ID],
  })

  return ops[0]
}

module.exports = createProviderOrganization
