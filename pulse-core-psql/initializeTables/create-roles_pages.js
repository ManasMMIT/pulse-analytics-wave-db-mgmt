const createRolesPages = async ({
  sequelize,
  Role,
  Page,
  shouldSeed,
}) => {
  const RolePage = await sequelize.import('roles_pages', require('./models/roles_pages'))

  RolePage.belongsTo(Page)
  RolePage.belongsTo(Role)
  Role.hasMany(RolePage, { onDelete: 'cascade' })
  Page.hasMany(RolePage, { onDelete: 'cascade' })

  if (shouldSeed) {
    await RolePage.sync({ force: true })

    const entriesToCreate = []
    for (let i = 1, j = 1; i < 25; i += 1, j += 1) {
      if (i === 5) j = 1
      if (i === 9) j = 1
      if (i === 20) j = 1

      entriesToCreate.push({
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        pageId: i,
        order: j,
      })
    }

    await RolePage.bulkCreate(entriesToCreate)
  }

  return RolePage
}

module.exports = createRolesPages
