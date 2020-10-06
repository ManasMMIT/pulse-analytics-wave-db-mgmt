const { ObjectId } = require('mongodb')
const _ = require('lodash')

const getEventEntityIdsByBoId = require('./getEventEntityIdsByBoId')

module.exports = async (events, pulseCoreDb) => {
  const eventEntitiesByBoId = getEventEntityIdsByBoId(events)

  const businessObjectsInPlay = await pulseCoreDb
    .collection('businessObjects')
    .find({ _id: { $in: Object.keys(eventEntitiesByBoId).map(ObjectId) } })
    .toArray()

  const boMap = _.keyBy(businessObjectsInPlay, '_id')

  const enrichEntitiesOps = Object.entries(eventEntitiesByBoId).map(
    ([boId, entityIds]) => {
      const {
        sourceCollection: { collection, query },
      } = boMap[boId]

      return pulseCoreDb
        .collection(collection)
        .find({ _id: { $in: entityIds }, ...(query || {}) })
        .toArray()
    }
  )

  const enrichedEntitiesByBo = await Promise.all(enrichEntitiesOps)
  const enrichedEntities = _.flatten(enrichedEntitiesByBo)
  const entityMap = _.keyBy(enrichedEntities, '_id')
  return { entityMap, boMap }
}
