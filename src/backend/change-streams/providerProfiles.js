module.exports = client => {
  const core = client.db('pulse-core')

  const providerProfilesChangeStream = core
    .collection('providerProfiles')
    .watch()

  providerProfilesChangeStream.on('change', next => {
    debugger
  })
}
