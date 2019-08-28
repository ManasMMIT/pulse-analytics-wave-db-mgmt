const express = require('express')
const _ = require('lodash')
const uuid = require('uuid/v4')

/*
  ? Should we name-space source CRUD under `source
  ? and role-specific CRUD under roles?

  ? /nodes/src/:nodeId
  ? /nodes/roles/:nodeId (the equivalent of `nodes/:nodeId/roles`, below)

  * This would allow for another layer of subApp delegation.
  * Also would break this giant file up and make more readable.
*/

// ! needed once we convert all uuids to mongo ObjectIds
// const ObjectId = require('mongodb').ObjectId

const NODE_TYPES = [
  'tool',
  'dashboard',
  'page',
  'card',
  'content',
]

const getNodeTypesFilter = nodeId => (
  NODE_TYPES.map(type => (
    { [`sitemap.${type}s`]: { $elemMatch: { _id: nodeId } } }
  ))
)

module.exports = ({
  mongoClient,
  coreRoles,
  coreNodes,
}) => {
  const subApp = express()

  subApp.get('/', async (req, res) => {
    const nodes = await coreNodes
      .find()
      .sort({
        type: 1,
        order: 1,
      })
      .toArray()

    res.json(nodes)
  })

  subApp.get('/:nodeId', async ({
    params: { nodeId }
  }, res, next) => {
    if (!nodeId) {
      next('Node ID required to fetch node')
      return
    }

    const node = await coreNodes.findOne({ _id: nodeId })
    res.json(node)
  })

  subApp.post('/', async ({ body }, res, next) => {
    if (!body.name || !body.type || !body.order) {
      next('Name, type, and order are all required to create source node')
      return
    } else if (!NODE_TYPES.includes(body.type)) {
      next(`${ body.type } is not an accepted node type. Must be one of the following: ${ NODE_TYPES }`)
      return
    }

    const node = await coreNodes.insertOne({ _id: uuid(), ...body })

    res.json(node.ops[0])
  })

  subApp.patch('/:nodeId', async ({
    params: { nodeId },
    body,
  }, res, next) => {
    if (!nodeId) {
      next('Node ID required to update node')
      return
    } else if (body.type && !NODE_TYPES.includes(body.type)) {
      next(`${body.type} is not an accepted node type. Must be one of the following: ${NODE_TYPES}`)
      return
    }

    const updatedNode = await coreNodes.findOneAndUpdate(
      { _id: nodeId },
      { $set: { ...body } },
      { returnOriginal: false }
    )

    res.json(updatedNode.value)
  })

  // subApp.delete('/:nodeId', async ({
  //   params: { nodeId }
  // }, res, next) => {
  //   if (!nodeId) {
  //     next('Node id required for deletion')
  //     return
  //   }

  //   const session = mongoClient.startSession()

  //   try {
  //     await session.withTransaction(async () => {
  //       const { value: deletedNode } = await coreNodes.findOneAndDelete(
  //         { _id: nodeId },
  //         { session }
  //       )

  //       const rolesToUpdate = await coreRoles.find(
  //         { [`sitemap.${ deletedNode.type }s._id`]: nodeId },
  //         { session }
  //       ).toArray()

  //       const promiseArray = rolesToUpdate.map(({ _id }) => {
  //         return coreRoles.updateOne(
  //           { _id },
  //           { $pull: { [`sitemap.${ deletedNode.type }s`]: { _id: nodeId } } },
  //           { session }
  //         )
  //       })

  //       await Promise.all(promiseArray)

  //       res.json(deletedNode)
  //     })
  //   } catch(error) {
  //     next(error)
  //     return
  //   }
  // })

  subApp.get('/:nodeId/roles', async ({
    params: { nodeId }
  }, res) => {
    // TODO find all roles with local copy of node
    const filterOptions = getNodeTypesFilter(nodeId)

    const roles = await coreRoles.find({ $or: filterOptions }).toArray()

    res.json(roles)
  })

  // ! updates all role copies of node, AS WELL AS source node
  subApp.patch('/:nodeId/roles', async ({
    params: { nodeId },
    body
  }, res, next) => {
    if (!nodeId) {
      next('node id required')
      return
    } else if (!body.type) {
      next('type field is required')
      return
    } else if (!NODE_TYPES.includes(body.type)) {
      next(`${ body.type } is not an accepted node type. Must be one of the following: ${ NODE_TYPES }`)
      return
    }

    if (body.order) body.order = parseInt(body.order)

    const session = mongoClient.startSession()

    try {
      await session.withTransaction(async () => {
        const updatedSourceNode = await coreNodes.findOneAndUpdate(
          { _id: nodeId },
          { $set: { ...body } },
          {
            returnOriginal: false,
            session
          }
        )

        const rolesToUpdate = await coreRoles.find(
          { [`sitemap.${body.type}s._id`]: nodeId },
          { session }
        ).toArray()

        const pullThenPushPromiseArray = rolesToUpdate
          .map(({ _id }) => {
            const pullPushPromise =  async () => {
              await coreRoles.updateOne(
                { _id },
                { $pull: { [`sitemap.${ body.type }s`]: { _id: nodeId } } },
                { session }
              )

              await coreRoles.updateOne(
                { _id },
                { $push: { [`sitemap.${ body.type }s`]: updatedSourceNode.value } },
                { session }
              )
            }

            return pullPushPromise()
          })

        await Promise.all(pullThenPushPromiseArray)

        res.send(updatedSourceNode.value)
      })
    } catch (error) {
      next(error)
      return
    }
  })

  subApp.patch('/:nodeId/roles/:roleId', async ({
    params: { nodeId, roleId },
    body,
  }, res, next) => {
    if (!nodeId || !roleId) {
      next('Role and node id are both required fields')
      return
    } else if (!body.type) {
      next('type field is required')
      return
    } else if (!NODE_TYPES.includes(body.type)) {
      next(`${ body.type } is not an accepted node type. Must be one of the following: ${ NODE_TYPES }`)
      return
    }

    body.order = Number(body.order)
    const session = mongoClient.startSession()

    try {
      await session.withTransaction(async () => {
        /*const updateOne = */ await coreRoles.findOneAndUpdate(
          { _id: roleId },
          { $pull: { [`sitemap.${ body.type }s`]: { _id: nodeId } } },
          { returnOriginal: false, session, },
        )

        const updateTwo = await coreRoles.findOneAndUpdate(
          { _id: roleId },
          { $push: { [`sitemap.${ body.type }s`]: { _id: nodeId, ...body } } },
          { returnOriginal: false, session, },
        )

        res.json(updateTwo.value)
      })
    } catch (error) {
      next(error)
      return
    }
  })

  subApp.post('/:nodeId/roles/:roleId', async ({
    params: { nodeId, roleId },
  }, res, next) => {
    const session = mongoClient.startSession()

    try {
      session.withTransaction(async () => {
        const sourceNode = await coreNodes.findOne(
          { _id: nodeId },
          { session }
        )

        if (!Boolean(sourceNode)) {
          next('Source node invalid')
          return
        }

        const updatedRole = await coreRoles.findOneAndUpdate(
          { _id: roleId },
          { $addToSet: { [`sitemap.${sourceNode.type}s`]: sourceNode } },
          {
            returnOriginal: false,
            session,
          },
        )
        res.json(updatedRole.value)
      })
    } catch (error) {
      next(error)
      return
    }
  })

  subApp.delete('/:nodeId/roles/:roleId', async ({
    params: { nodeId, roleId },
    body: { type }
  }, res, next) => {
    if (!type) {
      next('type field is required')
      return
    } else if (!NODE_TYPES.includes(type)) {
      next(`${ type } is not an accepted node type. Must be one of the following: ${NODE_TYPES}`)
      return
    }

    const updatedRole = await coreRoles.findOneAndUpdate(
      { _id: roleId },
      { $pull: { [`sitemap.${type}s`]: { _id: nodeId } } },
      { returnOriginal: false },
    )
    res.json(updatedRole.value)
  })

  return subApp
}
