// TODO: Delete user's association to role GROUP in auth0
const deleteUser = async (
  parent,
  { input: { _id } },
  {
    mongoClient,
    coreRoles,
    coreUsers,
    auth0,
  },
  info,
) => {
  // ! auth0
  await auth0.users.delete(_id)

  // ! mongodb
  const session = mongoClient.startSession()

  let deletedUser = null
  await session.withTransaction(async () => {
    // pull user out of all its roles
    await coreRoles.updateMany(
      { users: { $elemMatch: { _id } } },
      { $pull: { users: { _id } } },
      { session }
    )

    // delete user from source collection
    deletedUser = await coreUsers.findOne({ _id })
    await coreUsers.findOneAndDelete({ _id }, { session })
  })

  return deletedUser
}

module.exports = deleteUser
