const updateTeam = async (
  parent,
  { input: { _id, description } },
  { coreRoles },
  info
) => {
  const {
    value: roleInMongo
  } = await coreRoles.findOneAndUpdate(
    { _id },
    {
      $set: {
        name: description,
        description,
      }
    },
    { returnOriginal: false }
  )

  return roleInMongo
}

module.exports = updateTeam
