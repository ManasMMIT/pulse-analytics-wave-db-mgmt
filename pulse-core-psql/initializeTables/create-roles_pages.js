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

    const adminEntriesToCreate = []
    for (let i = 1, j = 1; i < 25; i += 1, j += 1) {
      if (i === 5) j = 1
      if (i === 9) j = 1
      if (i === 20) j = 1

      adminEntriesToCreate.push({
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        pageId: i,
        order: j,
      })
    }

    const regeneronPageIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    const regeneronEntriesToCreate = regeneronPageIds.map((pageId, i) => ({
      roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
      pageId,
      order: i + 1,
    }))

    const lillyAdminPageIds = [1, 2, 3, 4, 5, 6, 7, 8]
    const lillyAdminEntriesToCreate = lillyAdminPageIds.map((pageId, i) => ({
      roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
      pageId,
      order: i + 1,
    }))

    await RolePage.bulkCreate([
      ...adminEntriesToCreate,
      ...regeneronEntriesToCreate,
      ...lillyAdminEntriesToCreate,
    ])
  }

  return RolePage
}

module.exports = createRolesPages
