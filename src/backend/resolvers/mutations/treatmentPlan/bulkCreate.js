const { ObjectId } = require('mongodb')

const convertRegimenIds = regimen => {
  regimen._id = ObjectId(regimen._id)

  regimen.products.forEach(product => {
    product._id = ObjectId(product._id)
  })
}

const createTeam = async (
  parent,
  { input: { data } },
  { pulseCoreDb },
  info,
) => {
  const coreIndicationCollection = await pulseCoreDb.collection('indications')

  const updates = Object.keys(data).map(indication => {
    const regimens = data[indication]

    regimens.forEach(convertRegimenIds)

    return coreIndicationCollection.updateOne(
      { name: indication },
      {
        $addToSet: {
          regimens: {
            $each: regimens
          }
        }
      }
    )
  })

  await Promise.all(updates)

  return 'success'
}

module.exports = createTeam
