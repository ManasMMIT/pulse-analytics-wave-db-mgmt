const createProduct = (parent, { input: { _id, ...body } }, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('products').insertOne(body)
    .then(res => res.ops[0])
}

module.exports = createProduct
