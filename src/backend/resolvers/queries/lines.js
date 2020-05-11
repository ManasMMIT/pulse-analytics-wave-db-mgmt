module.exports = (
  parent,
  args,
  { pulseCoreDb }
) => pulseCoreDb
  .collection('lines')
  .find()
  .toArray()
