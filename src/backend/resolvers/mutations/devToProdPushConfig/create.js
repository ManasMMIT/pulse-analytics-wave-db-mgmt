const createDevToProdPushConfig = async (parent, args, { pulseCoreDb }, info) =>
  pulseCoreDb
    .collection('devToProdPushConfigs')
    .insertOne({
      name: '',
      collections: [],
    })
    .then((res) => res.ops[0])

module.exports = createDevToProdPushConfig
