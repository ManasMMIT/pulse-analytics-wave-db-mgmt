const updateOp = async ({
  session,
  coreClients,
  coreRoles,
  coreUsers,
  pulseDevDb,
  input: { _id, description },
}) => {
  const clientOp = coreClients.findOneAndUpdate(
    { _id },
    {
      $set: {
        name: description,
        description,
      },
    },
    { returnOriginal: false, session }
  )

  const embeddedSetOperation = {
    $set: {
      'client.name': description,
      'client.description': description,
    },
  }

  const rolesOp = coreRoles.updateMany(
    { 'client._id': _id },
    embeddedSetOperation,
    { session }
  )

  const usersOp = coreUsers.updateMany(
    { 'client._id': _id },
    embeddedSetOperation,
    { session }
  )

  const usersSitemapsOp = pulseDevDb
    .collection('users.sitemaps')
    .updateMany({ 'client._id': _id }, embeddedSetOperation, { session })

  const [{ value }] = await Promise.all([
    clientOp,
    rolesOp,
    usersOp,
    usersSitemapsOp,
  ])

  return value
}

module.exports = updateOp
