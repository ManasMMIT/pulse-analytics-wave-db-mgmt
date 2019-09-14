const initializeProviderProfilesChangeStream = require('./providerProfiles')

module.exports = client => {
  initializeProviderProfilesChangeStream(client)
}