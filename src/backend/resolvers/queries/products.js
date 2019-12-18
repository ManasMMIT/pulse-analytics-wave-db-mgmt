const products = (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('products')
    .find()
    .collation({ locale: 'en' })
    .sort({ nameBrand: 1 }) // temporary, as we're not sure if this is the desired field to sort by AND not all products have a nameBrand field.
    .toArray()
}

module.exports = products
