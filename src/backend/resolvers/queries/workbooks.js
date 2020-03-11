const workbooks = (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('workbooksConfig')
    .find().toArray()
}

module.exports = workbooks
