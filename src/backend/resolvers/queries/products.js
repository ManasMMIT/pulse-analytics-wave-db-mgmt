const products = (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('products').find().toArray()
}

module.exports = products
