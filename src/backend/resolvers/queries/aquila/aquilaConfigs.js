const aquilaConfigs = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('businessObjects.aquilaConfigs')
    .find()
    .toArray()
}

module.exports = aquilaConfigs
