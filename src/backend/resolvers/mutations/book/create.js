const createBook = (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('books')
    .insertOne({ name })
    .then(res => res.ops[0])

module.exports = createBook
