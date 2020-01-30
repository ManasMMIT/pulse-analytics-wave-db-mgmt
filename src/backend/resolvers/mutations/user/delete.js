const deleteUser = async (
  parent,
  { input: { _id } },
  {
    mongoClient,
    coreRoles,
    coreUsers,
    pulseDevDb,
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
    deletedUser = await coreUsers.findOne(
      { _id }
    )

    // pull user out of all its roles
    console.log(`\nbeginning process to delete ${ deletedUser.username }`)
    
    await coreRoles.updateMany(
      { users: { $elemMatch: { _id } } },
      { $pull: { users: { _id } } },
      { session }
    )

    console.log('user removed from their team(s)')
    
    await pulseDevDb.collection('users.sitemaps').deleteOne(
      { _id },
      { session }
    )

    await pulseDevDb.collection('users.nodes.resources').deleteOne(
      { _id },
      { session }
    )

    console.log('user no longer has sitemap or resources access')
    
    // delete user from source collection

    await coreUsers.findOneAndDelete({ _id }, { session })

    console.log(`${ deletedUser.username } successfully deleted\n`)
  })

  return deletedUser
}

module.exports = deleteUser
