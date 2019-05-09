const createPermissions = async ({
  sequelize,
  Role,
  Content,
  Resource,
  shouldSeed,
}) => {
  const Permission = await sequelize.import('permission', require('./models/permission'))

  Permission.belongsTo(Role)
  Permission.belongsTo(Content)
  Permission.belongsTo(Resource)
  Role.hasMany(Permission, { onDelete: 'cascade' })
  Content.hasMany(Permission, { onDelete: 'cascade' })
  Resource.hasMany(Permission, { onDelete: 'cascade' })

  if (shouldSeed) {
    await Permission.sync({ force: true })

    const adminPermissions = []
    for (let i = 1; i < 26; i += 1) {
      adminPermissions.push({
        order: 1,
        resourceId: i === 15 ? 2 : null,
        contentId: i,
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
      })
    }

    const regeneronContentIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    const regeneronPermissions = regeneronContentIds.map(contentId => ({
      order: 1,
      resourceId: contentId === 15 ? 1 : null,
      contentId,
      roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
    }))

    const lillyAdminContentIds = [1, 2, 3, 4, 5, 6, 7, 8]
    const lillyAdminPermissions = lillyAdminContentIds.map(contentId => ({
      order: 1,
      resourceId: null,
      contentId,
      roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
    }))

    await Permission.bulkCreate([
      ...adminPermissions,
      ...regeneronPermissions,
      ...lillyAdminPermissions,
    ])
  }

  return Permission
}

module.exports = createPermissions
