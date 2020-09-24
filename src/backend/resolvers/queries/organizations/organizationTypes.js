const organizationTypes = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').distinct('type')

module.exports = organizationTypes
