const ALLOWED_NODE_TYPES = ['tools', 'dashboards', 'pages', 'cards']

const updateNode = async (
  parent,
  { input: { teamId, nodeData } },
  { coreRoles },
  info
) => {
  if (!ALLOWED_NODE_TYPES.includes(nodeData.type + 's')) {
    throw new Error(`type field must be singularized version of one of the following: ${ALLOWED_NODE_TYPES.join(', ')}.`)
  }

  const { value: updatedTeam } = await coreRoles.findOneAndUpdate(
    { _id: teamId },
    {
      $set: {
        [`sitemap.${ nodeData.type }s.$[node]`]: nodeData
      },
    },
    {
      returnOriginal: false,
      arrayFilters: [
        {
          'node._id': nodeData._id,
        }
      ],
    },
  )

  const updatedNode = updatedTeam.sitemap[`${nodeData.type }s`].find(
    ({ _id }) => nodeData._id === _id
  )

  return updatedNode
}

module.exports = updateNode
