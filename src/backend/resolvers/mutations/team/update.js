const updateTeam = async (
  parent,
  { input: { _id, description } },
  { coreRoles, auth0 },
  info
) => {
  // ! auth0
  const roleInAuth0 = await auth0.roles
      .update({ id: _id, description })

  // ! mongodb
  const {
    value: roleInMongo
  } = await coreRoles.findOneAndUpdate(
    { _id },
    {
      $set: {
        name: roleInAuth0.name,
        description: roleInAuth0.description,
      }
    },
    { returnOriginal: false }
  )

  return roleInMongo
}

module.exports = updateTeam
