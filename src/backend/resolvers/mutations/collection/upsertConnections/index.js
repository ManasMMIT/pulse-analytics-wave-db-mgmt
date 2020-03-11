const upsertConnection = require('./upsert')
const {
  PAYER_TOOL_ID,
  PROVIDER_TOOL_ID,
  PATHWAYS_TOOL_ID,
  APM_TOOL_ID,
} = require('../../../../global-tool-ids')

const toolIdsMap = {
  'Alternative Payment Model': APM_TOOL_ID,
  'Pathways': PATHWAYS_TOOL_ID,
  'Payer': PAYER_TOOL_ID,
  'Provider': PROVIDER_TOOL_ID,
}

module.exports = async ({
  pulseCoreDb,
  mongoClient,
  data,
}) => {
  const organizationsCollection = pulseCoreDb.collection('organizations')

  const promisesArr = []

  data.forEach(datum => {
    const { _id, slugType, slugType1 } = datum

    if (!toolIdsMap[slugType] || !toolIdsMap[slugType1]) {
      console.error('invalid slugType! skipping problem row:', datum)
      return
    }

    promisesArr.push(
      upsertConnection({
        fullDocument: datum,
        organizationsCollection,
        toolIdsMap,
        mongoClient,
      }).then(() => {
        console.log('upsert executed for connection _id', _id.toString())
      })
      .catch(err => {
        console.error('upsert error for connection _id', _id.toString(), err)
      })
    )
  })

  await Promise.all(promisesArr)
}
