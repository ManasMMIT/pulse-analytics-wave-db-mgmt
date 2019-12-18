const regimens =  (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('regimens')
    .find()
    .collation({ locale: 'en' })
    .sort({ name: 1 })
    .toArray()
}

module.exports = regimens
