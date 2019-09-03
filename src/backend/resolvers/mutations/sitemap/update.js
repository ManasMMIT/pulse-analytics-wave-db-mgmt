const updateRoleSitemap = (parent, { input: { teamId, updatedSitemap } }, { pulseCoreDb }, info) => {
      return pulseCoreDb.collection('roles')
  .findOneAndUpdate(
    { _id: teamId },
    { $set: { sitemap: updatedSitemap } },
    { returnOriginal: false }
  )
  .then(({ value }) => value.sitemap)
}

module.exports = updateRoleSitemap
