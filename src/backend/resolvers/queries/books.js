module.exports = (
  parent,
  args,
  { pulseCoreDb }
) => pulseCoreDb
  .collection('books')
  .find()
  .toArray()
