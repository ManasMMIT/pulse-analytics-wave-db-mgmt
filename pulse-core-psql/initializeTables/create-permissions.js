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

    const regeneronPermissions = []
    const contentIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    contentIds.forEach(contentId => {
      regeneronPermissions.push({
        order: 1,
        resourceId: contentId === 15 ? 1 : null,
        contentId,
        roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
      })
    })

    await Permission.bulkCreate([
      ...adminPermissions,
      ...regeneronPermissions
    ])
  }

  return Permission
}

module.exports = createPermissions
