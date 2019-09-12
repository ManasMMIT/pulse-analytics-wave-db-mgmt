const deleteTeam = async (
  parent,
  { input: { _id, clientId } },
  { coreRoles, auth0 },
  info
) => {
  if (!Boolean(clientId)) {
    throw Error('must specify clientId')
  }

  // ! auth0
  await auth0.roles.delete({ id: _id, clientId })

  // ! mongodb
  const roleToDelete = await coreRoles
    .findOne({ _id })

  await coreRoles.findOneAndDelete({ _id })

  return roleToDelete
}

module.exports = deleteTeam
