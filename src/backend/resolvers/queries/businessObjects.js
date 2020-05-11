
module.exports = async (
  parent,
  args,
  { pulseCoreDb }
) => await pulseCoreDb
  .collection('businessObjects')
  .find()
  .toArray()
