const { ObjectId } = require('mongodb')

const connectObmServiceAndObmServiceCategory = async (
  parent,
  { 
    input: {
      _id,
      obmServiceId,
      obmServiceCategoryId,
    }
  },
  { pulseCoreDb },
  info,
) => {
  _id = _id ? ObjectId(_id) : ObjectId()
  obmServiceId = ObjectId(obmServiceId)
  obmServiceCategoryId = ObjectId(obmServiceCategoryId)

  const { value: newOrUpdatedDoc } = await pulseCoreDb
    .collection('obm.services_obm.services.categories')
    .findOneAndUpdate(
      { _id },
      {
        $set: {
          _id,
          obmServiceId,
          obmServiceCategoryId,
        }
      },
      { 
        upsert: true,
        returnOriginal: false,
      },
    )

  return newOrUpdatedDoc
}

module.exports = connectObmServiceAndObmServiceCategory
