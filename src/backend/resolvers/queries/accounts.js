const accounts = async (parent, { type }, { pulseCoreDb }) => {
  switch (type) {
    case 'pathways':
      return await pulseCoreDb.collection('pathways.accounts').find().toArray()
    case 'payer':
      return await pulseCoreDb.collection('payer.accounts').find().toArray()
    case 'provider':
      return await pulseCoreDb.collection('provider.accounts').find().toArray()
    case 'apm':
      return await pulseCoreDb.collection('apm.accounts').find().toArray()
    default:
      const pathways = await pulseCoreDb.collection('pathways.accounts').find().toArray()
      const payer = await pulseCoreDb.collection('payer.accounts').find().toArray()
      const provider = await pulseCoreDb.collection('provider.accounts').find().toArray()
      const apm = await pulseCoreDb.collection('apm.accounts').find().toArray()

      return pathways.concat(payer).concat(provider).concat(apm)
  }
}

module.exports = accounts
