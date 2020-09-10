const devToProdPushConfigs = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('devToProdPushConfigs').find().toArray()

module.exports = devToProdPushConfigs
