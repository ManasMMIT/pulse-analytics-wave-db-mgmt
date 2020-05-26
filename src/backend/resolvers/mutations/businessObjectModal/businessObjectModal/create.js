const { ObjectId } = require('mongodb')

const getDefaultTagsWithIds = () => [
  {
    _id: ObjectId(),
    label: 'Default Tag',
    sections: [
      {
        _id: ObjectId(),
        label: 'Default Section',
        fields: [],
      }
    ]
  }
]

const createBusinessObjectModal = async (
  parent,
  { input: { label, boId } },
  { pulseCoreDb }
) => {
  boId = ObjectId(boId)

  const isValidBoId = await pulseCoreDb.collection('businessObjects')
    .findOne({ _id: boId })

  if (!isValidBoId) throw new Error('Invalid business object id.')

  return await pulseCoreDb.collection('businessObjects.modals')
    .insertOne({
      label,
      boId,
      tags: getDefaultTagsWithIds(),
    })
    .then(res => res.ops[0])
}
module.exports = createBusinessObjectModal
