const upsertConnection = require('./upsert')
const {
  PAYER_TOOL_ID,
  PROVIDER_TOOL_ID,
  PATHWAYS_TOOL_ID,
  APM_TOOL_ID,
} = require('../../global-tool-ids')

const toolIdsMap = {
  'Alternative Payment Model': APM_TOOL_ID,
  'Pathways': PATHWAYS_TOOL_ID,
  'Payer': PAYER_TOOL_ID,
  'Provider': PROVIDER_TOOL_ID,
}

module.exports = ({
  pulseRawDb,
  pulseCoreDb,
  mongoClient,
}) => {
  const orgConnectionsChangeStream = pulseRawDb.collection('orgConnections')
    .watch({ fullDocument: 'updateLookup' })

  orgConnectionsChangeStream.on('change', async next => {
    const { operationType, fullDocument } = next
    const { _id, slugType, slugType1 } = fullDocument

    if (!toolIdsMap[slugType] || !toolIdsMap[slugType1]) {
      console.error('invalid slugType! change stream termininated with no changes')
      return
    }

    const organizationsCollection = pulseCoreDb.collection('organizations')

    if (['insert', 'replace', 'update'].includes(operationType)) {
      await upsertConnection({
        mongoClient,
        fullDocument,
        organizationsCollection,
        toolIdsMap,
      })

      console.log(operationType, 'executed for connection _id', _id.toString())
    }
  })
}
