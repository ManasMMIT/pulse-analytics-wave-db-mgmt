module.exports = (
  parent,
  args,
  { pulseCoreDb }
) => pulseCoreDb
  .collection('coverages')
  .find()
  .toArray()
