const updateOp = async ({
  session,
  coreClients,
  coreRoles,
  coreUsers,
  pulseDevDb,
  input: { _id, description },
}) => {
  const { value } = await coreClients.findOneAndUpdate(
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

  await coreRoles.updateMany({ 'client._id': _id }, embeddedSetOperation, {
    session,
  })

  await coreUsers.updateMany({ 'client._id': _id }, embeddedSetOperation, {
    session,
  })

  await pulseDevDb
    .collection('users.sitemaps')
    .updateMany({ 'client._id': _id }, embeddedSetOperation, { session })

  return value
}

module.exports = updateOp
