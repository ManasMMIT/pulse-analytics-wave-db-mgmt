const bomConfigs = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('businessObjects.modals')
    .find()
    .toArray()
}

module.exports = bomConfigs
