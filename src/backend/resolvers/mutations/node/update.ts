import _ from 'lodash'
const upsertUserSitemaps = require('../sitemap/upsertUsersSitemaps')
const NODE_TYPES = ['tool', 'dashboard', 'page', 'card']

interface TextObj {
  [key: string]: string
}

interface Node {
  _id: string
  name: string
  type: string
  componentPath: string | null
  text: TextObj | null
  order: number
  parentId: string | null
  // TODO: Deprecate following fields from schema (now inside textObj)
  caption: string | null
  subtitle: string | null
  icon: string | null
}

const updateNode = async (
  parent,
  args: { input: { node: Node, cascade: boolean } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const {
    cascade,
    node: { _id, ...body },
  } = args.input

  // ! Only needed until create node is built to always persist at least text: {} (NO POSTMAN!)
  if (!body.text) body.text = {}

  // ! This is set elsewhere and should not be persisted in this resolver
  delete body.text.tdgTimestamp

  if (body.type && !NODE_TYPES.includes(body.type)) {
    throw new Error(
      `${body.type} is not an accepted node type. Must be one of the following: ${NODE_TYPES}`
    )
  }

  let updatedNode
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    updatedNode = await pulseCoreDb
      .collection('nodes')
      .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false, session })
      .then(({ value }) => value)

    if (cascade) {
      const setObj = Object.keys(body).reduce((acc, key) => {
        acc[`sitemap.${body.type}s.$.${key}`] = body[key]

        return acc
      }, {})

      await pulseCoreDb.collection('roles').updateMany(
        { [`sitemap.${body.type}s`]: { $elemMatch: { _id: updatedNode._id } } },
        { $set: setObj },
        { session }
      )

      const rolesBeingAffected = await pulseCoreDb.collection('roles')
        .find({
          [`sitemap.${body.type}s`]: {
            $elemMatch: { _id: updatedNode._id }
          }
        }, { session }).toArray()

      let usersAcrossRoles = rolesBeingAffected
        .reduce((acc, role) => [...acc, ...role.users], [])

      usersAcrossRoles = _.uniqBy(usersAcrossRoles, '_id')

      await upsertUserSitemaps({
        users: usersAcrossRoles,
        session,
        pulseDevDb,
        pulseCoreDb,
      })
    }
  })

  return updatedNode
}

export default updateNode
