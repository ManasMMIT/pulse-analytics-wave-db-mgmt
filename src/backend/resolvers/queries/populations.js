module.exports = (
  parent,
  args,
  { pulseCoreDb }
) => pulseCoreDb
  .collection('populations')
  .find()
  .toArray()
