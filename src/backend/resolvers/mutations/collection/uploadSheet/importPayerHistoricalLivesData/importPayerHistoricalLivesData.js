const CoreToDev = require('./CoreToDev')

module.exports = async ({ pulseCore, pulseDev }) => {
  const coreToDev = new CoreToDev({ pulseCore, pulseDev })

  await coreToDev.materializeLivesCollections()
}
