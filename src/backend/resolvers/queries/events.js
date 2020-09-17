// TODO: Figure out a less brittle way to generate bo labels from entities.
const BO_LABEL_MAP = {
  Person: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  Pathways: ({ organizationTiny, organization }) =>
    organizationTiny || organization,
}

module.exports = async (parent, args, { pulseCoreDb }, info) => {
  const eventsWithBusinessObjectData = await pulseCoreDb
    .collection('events')
    .aggregate(initialAggPipeline, { allowDiskUse: true })
    .toArray()

  const enrichedEntityOps = eventsWithBusinessObjectData.map((event) => {
    return event.metaType === 'basic'
      ? enrichBasicEventEntity(event, pulseCoreDb)
      : enrichRelationalEventEntities(event, pulseCoreDb)
  })

  return await Promise.all(enrichedEntityOps)
}

const enrichBasicEventEntity = async (
  {
    _id,
    userId,
    username,
    action,
    timestamp,
    entityId,
    businessObject,
    deltas,
    metaType,
  },
  db
) => {
  const {
    name: boName,
    sourceCollection: { collection, query },
  } = businessObject
  const extraQueryVars = query || {}
  const entity = await db
    .collection(collection)
    .findOne({ _id: entityId, ...extraQueryVars })

  const entityLabelFunc = BO_LABEL_MAP[boName]
  const label = entity && entityLabelFunc(entity)

  return {
    _id,
    userId,
    username,
    action,
    entity: { ...entity, label },
    timestamp,
    boName,
    deltas,
    metaType,
  }
}

const enrichRelationalEventEntities = async (
  {
    _id,
    userId,
    username,
    action,
    timestamp,
    deltas,
    connectedEntity1,
    connectedEntity2,
    metaType,
  },
  db
) => {
  const {
    name: boName1,
    sourceCollection: { collection: collection1, query: query1 },
  } = connectedEntity1.businessObject
  const extraQueryVars1 = query1 || {}
  let entity1 = await db
    .collection(collection1)
    .findOne({ _id: connectedEntity1._id, ...extraQueryVars1 })
  const entityLabelFunc1 = BO_LABEL_MAP[boName1]
  const label1 = entity1 && entityLabelFunc1(entity1)
  entity1 = { ...entity1, label: label1 }

  const {
    name: boName2,
    sourceCollection: { collection: collection2, query: query2 },
  } = connectedEntity2.businessObject
  const extraQueryVars2 = query2 || {}
  let entity2 = await db
    .collection(collection2)
    .findOne({ _id: connectedEntity2._id, ...extraQueryVars2 })

  const entityLabelFunc2 = BO_LABEL_MAP[boName2]
  const label2 = entity2 && entityLabelFunc2(entity2)
  entity2 = { ...entity2, label: label2 }

  const topLevelFields = {
    _id,
    userId,
    username,
    action,
    timestamp,
    deltas,
    metaType,
  }

  const connectedEntities = [
    { entity: entity1, boName: boName1 },
    { entity: entity2, boName: boName2 },
  ]

  return {
    ...topLevelFields,
    connectedEntities,
  }
}

const initialAggPipeline = [
  {
    $lookup: {
      from: 'businessObjects',
      localField: 'businessObject._id',
      foreignField: '_id',
      as: 'businessObject',
    },
  },
  {
    $addFields: {
      connectedEntity1: {
        $arrayElemAt: ['$connectedEntities', 0],
      },
      connectedEntity2: {
        $arrayElemAt: ['$connectedEntities', 1],
      },
    },
  },
  {
    $lookup: {
      from: 'businessObjects',
      localField: 'connectedEntity1.boId',
      foreignField: '_id',
      as: 'connectedEntity1.businessObject',
    },
  },
  {
    $lookup: {
      from: 'businessObjects',
      localField: 'connectedEntity2.boId',
      foreignField: '_id',
      as: 'connectedEntity2.businessObject',
    },
  },
  {
    $addFields: {
      businessObject: {
        $arrayElemAt: ['$businessObject', 0],
      },
      'connectedEntity1.businessObject': {
        $arrayElemAt: ['$connectedEntity1.businessObject', 0],
      },
      'connectedEntity2.businessObject': {
        $arrayElemAt: ['$connectedEntity2.businessObject', 0],
      },
    },
  },
  {
    $addFields: {
      metaType: {
        $cond: [
          {
            $eq: ['$connectedEntities', null],
          },
          'basic',
          'relational',
        ],
      },
    },
  },
  {
    $sort: {
      timestamp: -1,
    },
  },
]
